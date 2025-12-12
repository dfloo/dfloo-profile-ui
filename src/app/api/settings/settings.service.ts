import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LocalStorageService } from '@core/services';
import { MaterialTheme } from '@core/models';


@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private storage = inject(LocalStorageService);

    getSettings(): Observable<Settings> {
        const { materialTheme, customThemeConfig } = this.storage.getData();

        return of({
            ...defaultSettings,
            ...(materialTheme ? { materialTheme } : {}),
            customThemeConfig
        });
    }

    saveSettings(settings: Settings): Observable<Settings> {
        this.storage.setData(settings);

        return of({ ...settings });
    }
}

export const defaultSettings: Settings = {
    materialTheme: MaterialTheme.AzureBlue
};

export interface Settings {
    materialTheme: MaterialTheme;
    customThemeConfig?: CustomThemeConfig
}

export interface CustomThemeConfig {
    primary?: string;
    accent?: string;
    mode: 'light' | 'dark'
}
