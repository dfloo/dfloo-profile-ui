import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    OnInit,
    signal,
    WritableSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
} from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';

import { ProfileService } from '@api/profile';
import { defaultSettings, Settings, SettingsService } from '@api/settings';
import { ProfileFormComponent } from '@components/profile-form';
import { SettingsFormComponent } from '@components/settings-form';
import { ThemeService } from '@core/services';
import { Profile } from '@models/profile';

export enum UserModalView {
    Profile = 0,
    Settings = 1,
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
        ProfileFormComponent,
        SettingsFormComponent,
        MatToolbar,
    ],
})
export class UserModalComponent implements OnInit {
    private data = inject(MAT_DIALOG_DATA);
    private profileService = inject(ProfileService);
    private themeService = inject(ThemeService);
    private settingsService = inject(SettingsService);

    selectedTab = signal(UserModalView.Settings);
    profile: WritableSignal<Profile> = signal(new Profile({}));
    settings: WritableSignal<Settings> = signal(defaultSettings);
    profileSnapshot?: Profile;
    settingsSnapshot?: Settings;
    showTabs?: boolean;

    get showSubmit(): boolean {
        if (this.selectedTab() === UserModalView.Profile) {
            return this.profileChanged;
        } else if (this.selectedTab() === UserModalView.Settings) {
            return this.settingsChanged;
        }

        return false;
    }

    get profileChanged(): boolean {
        return !isEqual(this.profile(), this.profileSnapshot);
    }

    get settingsChanged(): boolean {
        return !isEqual(this.settings(), this.settingsSnapshot);
    }

    constructor() {
        effect(() => {
            this.profileSnapshot = cloneDeep(this.profile());
        });
        effect(() => {
            this.settingsSnapshot = cloneDeep(this.settings());
        });
    }

    ngOnInit(): void {
        this.showTabs = this.data.showTabs;
        this.selectedTab.set(this.data.view);
        this.profileService.getUserProfile().subscribe({
            next: (profile) => this.profile.set(profile),
            error: () => undefined,
        });
        this.settingsService.getSettings().subscribe((settings) => {
            this.settings.set(settings);
        });
    }

    submit(): void {
        const view = this.selectedTab();
        if (view === UserModalView.Profile) {
            this.submitProfile();
        } else if (view === UserModalView.Settings) {
            this.submitSettings();
        }
    }

    cancel(): void {
        const view = this.selectedTab();
        if (view === UserModalView.Profile && this.profileSnapshot) {
            this.profile.set(this.profileSnapshot);
        } else if (view === UserModalView.Settings && this.settingsSnapshot) {
            this.settings.set(this.settingsSnapshot);
        }
    }

    private submitSettings(): void {
        const { materialTheme, customThemeConfig } = this.settings();

        this.themeService.applyTheme(materialTheme, customThemeConfig);

        this.settingsService
            .saveSettings(this.settings())
            .subscribe((savedSettings) => {
                this.settings.set(savedSettings);
            });
    }

    private submitProfile(): void {
        const submit = this.profile().isNew
            ? this.profileService.createUserProfile(this.profile())
            : this.profileService.updateUserProfile(this.profile());

        submit.subscribe((savedProfile) => {
            this.profile.set(savedProfile);
        });
    }
}
