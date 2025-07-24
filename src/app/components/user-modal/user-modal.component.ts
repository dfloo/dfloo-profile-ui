import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

export enum UserModalView {
    Profile = 0,
    Settings = 1
}

@Component({
    imports: [
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule
    ],
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent implements OnInit {
    selectedTab = signal(UserModalView.Profile);

    private dialogRef = inject(MatDialogRef<UserModalComponent>);
    private data = inject(MAT_DIALOG_DATA);

    ngOnInit(): void {
        this.selectedTab.set(this.data.view);
    }

    close(): void {
        this.dialogRef.close();
    }
}
