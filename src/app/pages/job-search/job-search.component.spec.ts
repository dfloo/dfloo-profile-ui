import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileService } from '@api/profile';
import { JobApplicationService } from '@api/job-application';
import { ResumeService } from '@api/resume';
import { UserService } from '@core/services';
import { Profile } from '@models/profile';

import { JobSearchComponent } from './job-search.component';
import { ActivatedRoute } from '@angular/router';

describe('JobSearchComponent', () => {
    let component: JobSearchComponent;
    let fixture: ComponentFixture<JobSearchComponent>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockProfileService: jasmine.SpyObj<ProfileService>;
    let mockUserService: jasmine.SpyObj<UserService>;
    let mockJobApplicationService: jasmine.SpyObj<JobApplicationService>;

    beforeEach(async () => {
        mockResumeService = jasmine.createSpyObj('ResumeService', [
            'getResumes',
        ]);
        mockResumeService.getResumes.and.returnValue(of([]));

        mockProfileService = jasmine.createSpyObj('ProfileService', [
            'getUserProfile',
        ]);
        mockProfileService.getUserProfile.and.returnValue(of(new Profile({})));

        mockUserService = jasmine.createSpyObj('UserService', ['hasRole']);
        mockUserService.hasRole.and.returnValue(of(false));

        mockJobApplicationService = jasmine.createSpyObj(
            'JobApplicationService',
            ['getJobApplications']
        );
        mockJobApplicationService.getJobApplications.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [
                JobSearchComponent,
            ],
            providers: [
                {
                    provide: ResumeService,
                    useValue: mockResumeService,
                },
                {
                    provide: ProfileService,
                    useValue: mockProfileService,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JobApplicationService,
                    useValue: mockJobApplicationService,
                },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: {} }
                },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(JobSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
