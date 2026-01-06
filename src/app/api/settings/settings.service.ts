import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LocalStorageService } from '@core/services';
import { defaultSettings, Settings } from './settings';


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
            ...(customThemeConfig ? { customThemeConfig } : {})
        });
    }

    saveSettings(settings: Settings): Observable<Settings> {
        this.storage.setData(settings);

        return of({ ...settings });
    }
}
