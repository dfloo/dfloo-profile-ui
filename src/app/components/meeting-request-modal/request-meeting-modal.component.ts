import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatToolbar } from '@angular/material/toolbar';
import { finalize } from 'rxjs';

import { MeetingRequestService } from '@api/meeting-request';
import { SnackBarService } from '@core/services';

@Component({
    templateUrl: './request-meeting-modal.component.html',
    styleUrl: './request-meeting-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        MatToolbar,
        ReactiveFormsModule,
    ],
})
export class MeetingRequestModalComponent {
    private dialogRef = inject(MatDialogRef<MeetingRequestModalComponent>);
    private meetingRequestService = inject(MeetingRequestService);
    private snackBarService = inject(SnackBarService);

    isSubmitting = signal(false);

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });

    submit(): void {
        if (this.form.invalid || this.isSubmitting()) return;

        this.isSubmitting.set(true);
        this.meetingRequestService
            .createMeetingRequest(this.form.getRawValue())
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.snackBarService.open("Meeting request sent! Devin will be in touch soon.");
                    this.dialogRef.close();
                },
            });
    }
}
