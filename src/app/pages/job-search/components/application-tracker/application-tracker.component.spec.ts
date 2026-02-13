import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { JobApplicationService } from '@api/job-application';
import { ResumeService } from '@api/resume';
import {
    JobApplication,
    JobApplicationStatus,
} from '@models/job-application';
import { Resume } from '@models/resume';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ApplicationTrackerComponent } from './application-tracker.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

describe('ApplicationTrackerComponent', () => {
    let component: ApplicationTrackerComponent;
    let fixture: ComponentFixture<ApplicationTrackerComponent>;
    let mockJobApplicationService: jasmine.SpyObj<JobApplicationService>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        mockJobApplicationService = jasmine.createSpyObj('JobApplicationService', [
            'getJobApplications',
            'createJobApplication',
            'updateApplications',
        ]);
        mockResumeService = jasmine.createSpyObj('ResumeService', ['getResumes']);
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

        mockJobApplicationService.getJobApplications.and.returnValue(of([]));
        mockResumeService.getResumes.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [ApplicationTrackerComponent],
            providers: [
                { provide: JobApplicationService, useValue: mockJobApplicationService },
                { provide: ResumeService, useValue: mockResumeService },
                { provide: MatDialog, useValue: mockDialog },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationTrackerComponent);
        component = fixture.componentInstance;
    });

    it('should create and load applications and resumes on init', () => {
        const app1 = new JobApplication({ id: 'a1', status: JobApplicationStatus.Unsubmitted });
        const app2 = new JobApplication({ id: 'a2', status: JobApplicationStatus.Submitted });
        const resumes = [new Resume({ id: 'r1' })];

        mockJobApplicationService.getJobApplications.and.returnValue(of([app1, app2]));
        mockResumeService.getResumes.and.returnValue(of(resumes));

        fixture.detectChanges();

        expect(component.jobApplications()).toEqual([app1, app2]);
        expect(component.resumes).toEqual(resumes);
    });

    it('appsByStatus computed groups apps by their status', () => {
        const app1 = new JobApplication({ id: 'a1', status: JobApplicationStatus.Unsubmitted });
        const app2 = new JobApplication({ id: 'a2', status: JobApplicationStatus.Submitted });

        component.jobApplications.set([app1, app2]);

        const grouped = component.appsByStatus();

        expect(grouped[JobApplicationStatus.Unsubmitted]).toContain(app1);
        expect(grouped[JobApplicationStatus.Submitted]).toContain(app2);
    });

    it('openJobApplicationModal creates new application when dialog returns result with no id', () => {
        const result = new JobApplication({ id: undefined, status: JobApplicationStatus.Unsubmitted });
        const dialogRef = { afterClosed: () => of(result) } as unknown as MatDialogRef<unknown>;
        mockDialog.open.and.returnValue(dialogRef);

        const created = new JobApplication({ id: 'new', status: JobApplicationStatus.Unsubmitted });
        mockJobApplicationService.createJobApplication.and.returnValue(of(created));

        fixture.detectChanges();

        component.openJobApplicationModal();

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockJobApplicationService.createJobApplication).toHaveBeenCalledWith(result);
        expect(component.jobApplications().some((a) => a.id === 'new')).toBeTrue();
    });

    it('openJobApplicationModal updates application when dialog returns edited item', () => {
        fixture.detectChanges();
        const existing = new JobApplication({ id: '1', status: JobApplicationStatus.Unsubmitted });
        component.jobApplications.set([existing]);

        const edited = { ...existing, company: 'NewCo' } as JobApplication;
        const dialogRef = { afterClosed: () => of(edited) } as unknown as MatDialogRef<unknown>;
        mockDialog.open.and.returnValue(dialogRef);

        mockJobApplicationService.updateApplications.and.returnValue(of([edited]));

        fixture.detectChanges();

        component.openJobApplicationModal(existing);

        expect(mockJobApplicationService.updateApplications).toHaveBeenCalledWith([edited]);
        expect(component.jobApplications()[0].company).toBe('NewCo');
    });

    it('drop reorders within same status and updates sortIndex', () => {
        const s = JobApplicationStatus.Unsubmitted;
        const container = { id: s };
        const a = new JobApplication({ id: '1', status: s });
        const b = new JobApplication({ id: '2', status: s });
        const c = new JobApplication({ id: '3', status: s });
        component.jobApplications.set([a, b, c]);

        const event = {
            container,
            previousContainer: container,
            previousIndex: 0,
            currentIndex: 2,
        } as unknown as CdkDragDrop<JobApplication[]>;

        component.drop(event);

        const apps = component.jobApplications();
        expect(apps[0].id).toBe('2');
        expect(apps[2].id).toBe('1');
        expect(apps[0].sortIndex).toBe(0);
        expect(apps[2].sortIndex).toBe(2);
    });

    it('drop moves between statuses and assigns new status and sortIndex', () => {
        const s1 = JobApplicationStatus.Unsubmitted;
        const s2 = JobApplicationStatus.Submitted;
        const a = new JobApplication({ id: '1', status: s1 });
        const b = new JobApplication({ id: '2', status: s2 });
        component.jobApplications.set([a, b]);

        const event = {
            container: { id: s2 },
            previousContainer: { id: s1 },
            previousIndex: 0,
            currentIndex: 1,
        } as unknown as CdkDragDrop<JobApplication[]>;

        component.drop(event);

        const apps = component.jobApplications();
        const moved = apps.find((x) => x.id === '1');
        expect(moved?.status).toBe(s2);
        expect(moved?.sortIndex).toBeDefined();
    });

    it('drop calls updateApplications when snapshots differ and applies updates', () => {
        const app = new JobApplication({ id: 'u1', status: JobApplicationStatus.Unsubmitted, company: 'A' });

        // populate snapshot map via ngOnInit behavior
        mockJobApplicationService.getJobApplications.and.returnValue(of([app]));
        fixture.detectChanges();

        // simulate a local change to the app before drop
        component.jobApplications.set([{ ...app, company: 'B' }]);

        const shared = { id: JobApplicationStatus.Unsubmitted };
        const event = {
            container: shared,
            previousContainer: shared,
            previousIndex: 0,
            currentIndex: 0,
        } as unknown as CdkDragDrop<JobApplication[]>;

        const updated = { ...app, company: 'B' } as JobApplication;
        mockJobApplicationService.updateApplications.and.returnValue(of([updated]));

        component.drop(event);

        expect(mockJobApplicationService.updateApplications).toHaveBeenCalled();
    });
});
