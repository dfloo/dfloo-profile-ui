import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import isEqual from 'lodash-es/isEqual';

import { JobApplicationService } from '@api/job-application';
import { ResumeService } from '@api/resume';
import { UserService } from '@core/services';
import {
    ActiveStatuses,
    JobApplication,
    JobApplicationStatus,
} from '@models/job-application';
import { Resume } from '@models/resume';

import {
    JobApplicationCardComponent,
    JobApplicationModalComponent,
} from './components';

@Component({
    selector: 'application-tracker',
    templateUrl: './application-tracker.component.html',
    styleUrl: './application-tracker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        JobApplicationCardComponent,
        CdkDrag,
        CdkDropList,
        CdkDropListGroup,
        MatButton,
    ],
})
export class ApplicationTrackerComponent implements OnInit {
    private jobApplicationService = inject(JobApplicationService);
    private resumeService = inject(ResumeService);
    private userService = inject(UserService);
    private dialog = inject(MatDialog);
    private appSnapshotMap = new Map<string, JobApplication>();

    JobApplicationStatus = JobApplicationStatus;
    ActiveStatuses = ActiveStatuses;
    jobApplications = signal<JobApplication[]>([]);
    appsByStatus = computed(() => {
        const apps = this.jobApplications();
        return ActiveStatuses.reduce(
            (acc, status) => {
                acc[status] = apps?.filter((app) => app.status === status);

                return acc;
            },
            {} as Record<JobApplicationStatus, JobApplication[]>,
        );
    });
    resumes: Resume[] = [];
    isAuthenticated = false;

    constructor() {
        this.userService.isAuthenticated$.pipe(takeUntilDestroyed())
            .subscribe((isAuthenticated: boolean) => {
                this.isAuthenticated = isAuthenticated;
            });
    }

    ngOnInit(): void {
        this.jobApplicationService.getJobApplications().subscribe((apps) => {
            this.jobApplications.set(apps);
            apps.forEach(this.updateSnapshot.bind(this));
        });
        this.resumeService.getResumes().subscribe((resumes) => {
            this.resumes = resumes;
        });
    }

    openJobApplicationModal(app?: JobApplication): void {
        const isNew = !app;
        this.dialog
            .open(JobApplicationModalComponent, {
                minWidth: '60vw',
                data: {
                    isNew,
                    isAuthenticated: this.isAuthenticated,
                    resumes: this.resumes,
                    jobApplication: app ? { ...app } : null,
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                if (isNew) {
                    this.createJobApplication(result);
                } else {
                    this.updateJobApplication(result);
                }
            });
    }

    drop(event: CdkDragDrop<JobApplication[]>): void {
        let apps: JobApplication[];
        if (event.container === event.previousContainer) {
            apps = this.reorderWithinStatus(event);
        } else {
            apps = this.updateStatusAndReorder(event);
        }

        this.jobApplications.set(apps);

        const appsToUpdate: JobApplication[] = [];
        apps.forEach((app) => {
            if (!app.id) {
                return;
            }
            const snapshot = this.appSnapshotMap.get(app.id);
            if (snapshot && !isEqual(snapshot, app)) {
                appsToUpdate.push(app);
            }
        });

        if (appsToUpdate.length) {
            this.jobApplicationService
                .updateApplications(appsToUpdate)
                .subscribe((updated) => {
                    const updatedAppsMap = new Map();
                    updated.forEach((app) => {
                        if (app.id) {
                            updatedAppsMap.set(app.id, app);
                            this.updateSnapshot(app);
                        }
                    });
                    this.jobApplications.set(
                        apps.map((app) => {
                            return updatedAppsMap.has(app.id)
                                ? updatedAppsMap.get(app.id)
                                : app;
                        }),
                    );
                });
        }
    }

    private reorderWithinStatus(
        event: CdkDragDrop<JobApplication[]>,
    ): JobApplication[] {
        const apps = this.jobApplications();
        const { container, currentIndex, previousIndex } = event;
        const currentStatus = container.id as JobApplicationStatus;
        const currentStatusApps = apps.filter(
            (a) => a.status === currentStatus,
        );
        const remainingApps = apps.filter((a) => a.status !== currentStatus);
        const moved = currentStatusApps[previousIndex];
        currentStatusApps.splice(previousIndex, 1);
        currentStatusApps.splice(currentIndex, 0, moved);

        return [
            ...currentStatusApps.map(this.updateSortIndex),
            ...remainingApps,
        ];
    }

    private updateStatusAndReorder(
        event: CdkDragDrop<JobApplication[]>,
    ): JobApplication[] {
        const apps = this.jobApplications();
        const { container, currentIndex, previousContainer, previousIndex } =
            event;
        const currentStatus = container.id as JobApplicationStatus;
        const previousStatus = previousContainer.id as JobApplicationStatus;
        const currentStatusApps = apps.filter(
            (a) => a.status === currentStatus,
        );
        const previousStatusApps = apps.filter(
            (a) => a.status === previousStatus,
        );
        const remainingApps = apps.filter(
            (a) => ![currentStatus, previousStatus].includes(a.status),
        );
        const moved = {
            ...previousStatusApps[previousIndex],
            status: currentStatus,
        };
        previousStatusApps.splice(previousIndex, 1);
        currentStatusApps.splice(currentIndex, 0, moved);

        return [
            ...currentStatusApps.map(this.updateSortIndex),
            ...previousStatusApps.map(this.updateSortIndex),
            ...remainingApps,
        ];
    }

    private updateSortIndex(app: JobApplication, index: number) {
        return { ...app, sortIndex: index };
    }

    private updateSnapshot(app: JobApplication): void {
        if (app.id) {
            this.appSnapshotMap.set(app.id, { ...app });
        }
    }

    private createJobApplication(app: JobApplication): void {
        this.jobApplicationService
            .createJobApplication(app)
            .subscribe((created) => {
                this.updateSnapshot(created);
                this.jobApplications.update((apps) => [...apps, created]);
            });
    }

    private updateJobApplication(app: JobApplication): void {
        this.jobApplicationService
            .updateApplications([app])
            .subscribe(([edited]) => {
                this.updateSnapshot(edited);
                this.jobApplications.update((apps) =>
                    apps.map((app) => (app.id === edited.id ? edited : app))
                );
            });
    }
}
