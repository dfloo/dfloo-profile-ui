import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    OnInit,
    signal,
    WritableSignal
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';

import { ProfileService } from '@api/profile';
import { ProfileFormComponent } from '@components/profile-form';
import { Profile } from '@models/profile';

export enum UserModalView {
    Profile = 0,
    Settings = 1
}

@Component({
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatTab,
        MatTabGroup,
        ProfileFormComponent
    ]
})
export class UserModalComponent implements OnInit {
    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<UserModalComponent>);
    private profileService = inject(ProfileService);

    selectedTab = signal(UserModalView.Profile);
    profile: WritableSignal<Profile> = signal(new Profile({}));
    profileSnapshot?: Profile;

    get profileHasChanges(): boolean {
        return !isEqual(this.profile(), this.profileSnapshot);
    }


    constructor() {
        effect(() => {
            this.profileSnapshot = cloneDeep(this.profile());
        });
    }

    ngOnInit(): void {
        this.selectedTab.set(this.data.view);
        this.profileService.getUserProfile().subscribe({
            next: profile => (this.profile.set(profile)),
            error: () => undefined
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    submitProfile(): void {
        const submit = this.profile().isNew
            ? this.profileService.createUserProfile(this.profile())
            : this.profileService.updateUserProfile(this.profile());
    
        submit.subscribe(savedProfile => {
            this.profile.set(savedProfile)
        });
    }

    revertProfileChanges(): void {
        if (this.profileSnapshot) {
            this.profile.set(this.profileSnapshot)
        }
    }
}
