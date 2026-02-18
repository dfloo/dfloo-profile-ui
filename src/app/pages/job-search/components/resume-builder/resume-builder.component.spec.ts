import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ResumeService } from '@api/resume';
import { ProfileService } from '@api/profile';
import { Profile } from '@models/profile';
import { UserService } from '@core/services';

import { ResumeBuilderComponent } from './resume-builder.component';
import { Resume } from '@models/resume';
import { SnackBarService } from '@core/services';

describe('ResumeBuilderComponent', () => {
    let component: ResumeBuilderComponent;
    let fixture: ComponentFixture<ResumeBuilderComponent>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockProfileService: jasmine.SpyObj<ProfileService>;
    let mockUserService: jasmine.SpyObj<UserService>;
    let mockSnackBar: jasmine.SpyObj<SnackBarService>;

    beforeEach(async () => {
        mockResumeService = jasmine.createSpyObj('ResumeService', [
            'getResumes',
            'deleteResumes',
            'createResume',
            'updateResume',
            'downloadResume',
            'setDefaultResume',
        ]);
        mockResumeService.getResumes.and.returnValue(of([]));
        mockResumeService.deleteResumes.and.returnValue(of([]));
        mockResumeService.createResume.and.returnValue(of());
        mockResumeService.updateResume.and.returnValue(of());
        mockResumeService.downloadResume.and.returnValue(of(new Blob()));
        mockResumeService.setDefaultResume.and.returnValue(of(new Map()));
        mockProfileService = jasmine.createSpyObj('ProfileService', [
            'getUserProfile',
        ]);
        mockProfileService.getUserProfile.and.returnValue(of(new Profile({})));
        mockUserService = jasmine.createSpyObj('UserService', ['hasRole']);
        mockUserService.hasRole.and.returnValue(of(false));

        mockSnackBar = jasmine.createSpyObj('SnackBarService', ['open']);

        await TestBed.configureTestingModule({
            imports: [ResumeBuilderComponent],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: ResumeService, useValue: mockResumeService },
                { provide: ProfileService, useValue: mockProfileService },
                { provide: SnackBarService, useValue: mockSnackBar },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ResumeBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the user profile', () => {
        expect(mockProfileService.getUserProfile).toHaveBeenCalled();
    });

    it('#deleteResumes should call the resume service', () => {
        const resumeIDs = ['1', '2'];
        component.deleteResumes(resumeIDs);

        expect(mockResumeService.deleteResumes).toHaveBeenCalledWith(resumeIDs);
    });

    it('ngOnInit should set resumes from service', () => {
        const mock = [new Resume({ id: 'r1', fileName: 'one' })];
        mockResumeService.getResumes.and.returnValue(of(mock));

        fixture = TestBed.createComponent(ResumeBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.resumes()).toEqual(mock);
    });

    it('deleteResumes shows success when all deleted', () => {
        const resumeIDs = ['1'];
        mockResumeService.deleteResumes.and.returnValue(of(resumeIDs));
        component.resumes.set([new Resume({ id: '1' })]);

        component.deleteResumes(resumeIDs);

        expect(mockResumeService.deleteResumes).toHaveBeenCalledWith(resumeIDs);
        expect(mockSnackBar.open)
            .toHaveBeenCalledWith('Resumes deleted successfully');
        expect(component.resumes().length).toBe(0);
    });

    it('deleteResumes shows warning when partial delete', () => {
        const resumeIDs = ['1', '2'];
        mockResumeService.deleteResumes.and.returnValue(of(['1']));
        component.resumes.set(
            [new Resume({ id: '1' }), new Resume({ id: '2' })]
        );

        component.deleteResumes(resumeIDs);

        expect(mockSnackBar.open)
            .toHaveBeenCalledWith('Some resumes were not deleted', 'warning');
        expect(component.resumes().length).toBe(1);
    });

    it('saveResume should create when isNew', () => {
        const newRes = new Resume({ id: undefined, isNew: true });
        const created = new Resume({ id: 'created' });
        mockResumeService.createResume.and.returnValue(of(created));

        component.resumes.set([]);
        component.saveResume(newRes);

        expect(mockResumeService.createResume).toHaveBeenCalledWith(newRes);
        expect(component.resume()).toEqual(created);
        expect(component.resumes().some((r) => r.id === 'created')).toBeTrue();
    });

    it('saveResume should update when not new', () => {
        const existing = new Resume({ id: 'e1', isNew: false, fileName: 'a' });
        const updated = new Resume({ id: 'e1', isNew: false, fileName: 'b' });
        component.resumes.set([existing]);
        mockResumeService.updateResume.and.returnValue(of(updated));

        component.saveResume(existing);

        expect(mockResumeService.updateResume).toHaveBeenCalledWith(existing);
        expect(component.resume()).toEqual(updated);
        expect(component.resumes()[0].fileName).toBe('b');
    });

    it('editResume sets the resume signal', () => {
        const r = new Resume({ id: 'x' });
        component.editResume(r);
        expect(component.resume()).toBe(r);
    });

    it('copyResume creates a copy and calls saveResume', () => {
        const orig = new Resume({ id: '1', isNew: false, fileName: 'orig' });
        const spy = spyOn(component, 'saveResume');

        component.copyResume(orig);

        expect(spy).toHaveBeenCalled();
        const calledArg = spy.calls.mostRecent().args[0] as Resume;
        expect(calledArg.id).toBeUndefined();
        expect(calledArg.isNew).toBeTrue();
        expect(calledArg.default).toBeFalse();
        expect(calledArg.fileName).toBe(orig.fileName);
        expect(calledArg.created).toBeDefined();
        expect(calledArg.updated).toBeDefined();
    });

    it('newResume initializes a new Resume with user profile', () => {
        const profile = new Profile({});
        mockProfileService.getUserProfile.and.returnValue(of(profile));

        fixture = TestBed.createComponent(ResumeBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.newResume();

        const r = component.resume();
        expect(r).toBeInstanceOf(Resume);
        expect(r?.profile).toEqual(profile);
    });

    it('downloadResume should create anchor and click', () => {
        const r = new Resume({ id: 'd1', fileName: 'file' });
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        mockResumeService.downloadResume.and.returnValue(of(blob));
        spyOn(URL, 'createObjectURL').and.returnValue('blob:url');

        const fakeAnchor = {
            href: '',
            download: '',
            click: jasmine.createSpy('click')
        } as unknown as HTMLAnchorElement;
        spyOn(document, 'createElement').and.returnValue(fakeAnchor);

        component.downloadResume(r);

        expect(mockResumeService.downloadResume).toHaveBeenCalledWith(r);
        expect(fakeAnchor.download).toBe('file.pdf');
        expect(fakeAnchor.click).toHaveBeenCalled();
    });

    it('viewResume should open a new window with blob url', () => {
        const r = new Resume({ id: 'v1', fileName: 'file' });
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        mockResumeService.downloadResume.and.returnValue(of(blob));
        spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
        const winSpy = spyOn(window, 'open');

        component.viewResume(r);

        expect(mockResumeService.downloadResume).toHaveBeenCalledWith(r);
        expect(winSpy).toHaveBeenCalledWith('blob:url');
    });

    it('setDefaultResume should update resumes map', () => {
        const a = new Resume({ id: 'a', fileName: 'a' });
        const b = new Resume({ id: 'b', fileName: 'b' });
        component.resumes.set([a, b]);

        const updatedA = new Resume({ id: 'a', fileName: 'a-updated' });
        const map = new Map<string, Resume>();
        map.set('a', updatedA);
        mockResumeService.setDefaultResume.and.returnValue(of(map));

        component.setDefaultResume('a');

        const res = component.resumes();
        expect(res.find((r) => r.id === 'a')?.fileName).toBe('a-updated');
        expect(res.find((r) => r.id === 'b')?.fileName).toBe('b');
    });
});
