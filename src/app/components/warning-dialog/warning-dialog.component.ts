import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';

@Component({
    templateUrl: './warning-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogActions, MatButton, MatDialogContent]
})
export class WarningDialogComponent {
    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<WarningDialogComponent>);

    Result = WarningDialogResult;

    get confirmLabel(): string {
        return this.data?.confirmLabel ?? 'OK'
    }

    get cancelLabel(): string {
        return this.data?.cancelLabel;
    }

    get alternateLabel(): string {
        return this.data?.alternateLabel;
    }

    get message(): string {
        return this.data?.message;
    }

    close(result: WarningDialogResult): void {
        this.dialogRef.close(result);
    }
}

export enum WarningDialogResult {
    Confirm = 'Confirm',
    Cancel = 'Cancel',
    Alternate = 'Alternate'
}