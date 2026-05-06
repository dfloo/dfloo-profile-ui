import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatToolbar } from '@angular/material/toolbar';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { finalize } from 'rxjs';

import { MeetingRequestService } from '@api/meeting-request';
import { SnackBarService } from '@core/services';

@Component({
    templateUrl: './request-meeting-modal.component.html',
    styleUrl: './request-meeting-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormlyForm,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
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

    form = new FormGroup({});
    model = { name: '', email: '', message: '' };
    fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                label: 'Name',
                required: true,
                attributes: { autocomplete: 'name' },
            },
        },
        {
            key: 'email',
            type: 'input',
            props: {
                label: 'Email',
                required: true,
                type: 'email',
                attributes: { autocomplete: 'email' },
            },
            validators: {
                email: {
                    expression: (c: AbstractControl) => !c.value || Validators.email(c) === null,
                    message: 'Invalid email address',
                },
            },
        },
        {
            key: 'message',
            type: 'textarea',
            props: {
                label: 'Message',
                required: true,
                rows: 5,
            },
        },
    ];

    submit(): void {
        if (this.form.invalid || this.isSubmitting()) return;

        this.isSubmitting.set(true);
        this.meetingRequestService
            .createMeetingRequest(this.model)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.snackBarService.open("Meeting request sent! Devin will be in touch soon.");
                    this.dialogRef.close();
                },
            });
    }
}
