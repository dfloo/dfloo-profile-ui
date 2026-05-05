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

import { SignupService } from '@api/signup';
import { SnackBarService } from '@core/services';

@Component({
    templateUrl: './signup-modal.component.html',
    styleUrl: './signup-modal.component.scss',
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
export class SignupModalComponent {
    private dialogRef = inject(MatDialogRef<SignupModalComponent>);
    private signupService = inject(SignupService);
    private snackBarService = inject(SnackBarService);

    isSubmitting = signal(false);

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });

    submit(): void {
        if (this.form.invalid || this.isSubmitting()) return;

        this.isSubmitting.set(true);
        this.signupService
            .createSignupRequest(this.form.getRawValue())
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.snackBarService.open("Signup request sent! You'll hear back soon.");
                    this.dialogRef.close();
                },
            });
    }
}
