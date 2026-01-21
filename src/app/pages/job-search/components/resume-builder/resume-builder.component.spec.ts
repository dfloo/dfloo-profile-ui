import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ResumeService } from '@api/resume';
import { ProfileService } from '@api/profile';
import { Profile } from '@models/profile';
import { UserService } from '@core/services';

import { ResumeBuilderComponent } from './resume-builder.component';

describe('ResumeBuilderComponent', () => {
    let component: ResumeBuilderComponent;
    let fixture: ComponentFixture<ResumeBuilderComponent>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockProfileService: jasmine.SpyObj<ProfileService>;
    let mockUserService: jasmine.SpyObj<UserService>;

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
        mockUserService = jasmine.createSpyObj('UserService', ['hasRole']);
        mockUserService.hasRole.and.returnValue(of(false));

        await TestBed.configureTestingModule({
            imports: [ResumeBuilderComponent],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
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
