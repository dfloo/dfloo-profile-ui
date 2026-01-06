import { Injectable } from '@angular/core';
import { JobApplication } from '@models/job-application';

import { CustomThemeConfig } from '@api/settings';
import { Resume } from '@models/resume';
import { MaterialTheme } from '@core/models';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private key = 'dflooData';

    getData(): LocalStorageData {
        const data = localStorage.getItem(this.key);

        return data ? JSON.parse(data) : {};
    }

    setData(data: LocalStorageData): void {
        localStorage.setItem(
            this.key,
            JSON.stringify({ ...this.getData(), ...data }),
        );
    }
}

interface LocalStorageData {
    resumes?: Resume[];
    jobApplications?: JobApplication[];
    materialTheme?: MaterialTheme;
    customThemeConfig?: CustomThemeConfig;
}
