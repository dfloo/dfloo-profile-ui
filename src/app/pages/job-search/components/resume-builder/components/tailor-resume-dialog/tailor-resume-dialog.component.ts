import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { JobApplicationService } from '@api/job-application';
import { ResumeService } from '@api/resume';
import {
    JobApplication,
    JobApplicationStatus,
} from '@models/job-application';
import { Resume } from '@models/resume';

interface TailorDialogData {
    resumeId: string;
}

type DialogPhase = 'form' | 'loading' | 'done' | 'error';

@Component({
    selector: 'tailor-resume-dialog',
    templateUrl: './tailor-resume-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatLabel,
        MatOption,
        MatProgressSpinner,
        MatSelect,
    ],
})
export class TailorResumeDialogComponent implements OnInit {
    private dialogRef = inject(MatDialogRef<TailorResumeDialogComponent>);
    private data: TailorDialogData = inject(MAT_DIALOG_DATA);
    private resumeService = inject(ResumeService);
    private jobApplicationService = inject(JobApplicationService);
    private destroyRef = inject(DestroyRef);

    phase = signal<DialogPhase>('form');
    applications = signal<JobApplication[]>([]);
    selectedApplication: JobApplication | null = null;
    private tailoredResume?: Resume;

    ngOnInit(): void {
        this.jobApplicationService
            .getJobApplications()
            .pipe(
                catchError(() => of([])),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((apps) => {
                this.applications.set(
                    apps.filter(
                        (a) => a.status === JobApplicationStatus.Unsubmitted,
                    ),
                );
            });
    }

    submit(): void {
        const app = this.selectedApplication;
        if (!app) return;

        this.phase.set('loading');
        this.resumeService
            .tailorResume(this.data.resumeId, {
                company: app.company,
                role: app.role,
                jobDescription: app.description,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (resume) => {
                    this.tailoredResume = resume;
                    this.phase.set('done');
                },
                error: () => this.phase.set('error'),
            });
    }

    apply(): void {
        this.dialogRef.close(this.tailoredResume);
    }

    discard(): void {
        this.dialogRef.close(null);
    }
}
