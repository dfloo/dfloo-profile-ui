import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';

@Component({
    templateUrl: './message-dialog.component.html',
    imports: [MatButtonModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageDialogComponent {
    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<MessageDialogComponent>);

    Result = MessageDialogResult;

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

    close(result: MessageDialogResult): void {
        this.dialogRef.close(result);
    }
}

export enum MessageDialogResult {
    Confirm = 'Confirm',
    Cancel = 'Cancel',
    Alternate = 'Alternate'
}