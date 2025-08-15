import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfileService } from '@api/profile';
import { ProfileFormComponent } from '@components/profile-form';
import { Profile } from '@models/profile';
import { Observable } from 'rxjs';

export enum UserModalView {
    Profile = 0,
    Settings = 1
}

@Component({
    imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    ProfileFormComponent
],
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent implements OnInit {
    selectedTab = signal(UserModalView.Profile);
    profile = new Profile({});

    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<UserModalComponent>);
    private profileService = inject(ProfileService)

    ngOnInit(): void {
        this.selectedTab.set(this.data.view);
        this.profileService.getProfile().subscribe(profile => {
            this.profile = profile;
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    onSubmitProfile(profile: Profile): void {
        let submit: Observable<Profile>;
        if (profile.isNew) {
            submit = this.profileService.createProfile(profile)
        } else {
            submit = this.profileService.updateProfile(profile)
        }
        submit.subscribe(profile => {
            this.profile = profile;
            this.close();
        });
    }
}
