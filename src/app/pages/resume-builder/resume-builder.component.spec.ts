import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBuilderComponent } from './resume-builder.component';
import { ResumeService } from '@api/resume';
import { ProfileService } from '@api/profile';
import { of } from 'rxjs';
import { Profile } from '@models/profile';

describe('ResumeBuilderComponent', () => {
    let component: ResumeBuilderComponent;
    let fixture: ComponentFixture<ResumeBuilderComponent>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockProfileService: jasmine.SpyObj<ProfileService>;

    beforeEach(async () => {
        mockResumeService = jasmine.createSpyObj('ResumeService', [
            'getResumes',
            'deleteResumes',
        ]);
        mockResumeService.getResumes.and.returnValue(of([]));
        mockResumeService.deleteResumes.and.returnValue(of());
        mockProfileService = jasmine.createSpyObj('ProfileService', [
            'getUserProfile',
        ]);
        mockProfileService.getUserProfile.and.returnValue(of(new Profile({})));
        await TestBed.configureTestingModule({
            imports: [ResumeBuilderComponent],
            providers: [
                {
                    provide: ResumeService,
                    useValue: mockResumeService,
                },
                {
                    provide: ProfileService,
                    useValue: mockProfileService,
                },
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
});
