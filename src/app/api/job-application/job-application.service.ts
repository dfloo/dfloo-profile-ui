import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

import { LocalStorageService } from '@core/services';
import { JobApplication, JobApplicationDTO } from '@models/job-application';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class JobApplicationService {
    private apiService = inject(ApiService);
    private auth = inject(AuthService);
    private storage = inject(LocalStorageService);
    private readonly path = 'job-applications';

    getJobApplications(): Observable<JobApplication[]> {
        return this.auth.isAuthenticated$.pipe(
            switchMap((isAuthenticated) => {
                if (!isAuthenticated) {
                    return of(this.getLocalJobApplications());
                }

                return this.apiService.get<JobApplicationDTO[]>(this.path).pipe(
                    map((apps) => {
                        return (
                            apps
                                ?.map(JobApplication.normalize)
                                .sort((a, b) => a.sortIndex - b.sortIndex) ?? []
                        );
                    }),
                );
            }),
        );
    }

    createJobApplication(app: JobApplication): Observable<JobApplication> {
        return this.auth.isAuthenticated$.pipe(
            switchMap((isAuthenticated) => {
                if (!isAuthenticated) {
                    return this.createLocalJobApplication(app);
                }

                return this.apiService
                    .post<JobApplicationDTO>(
                        this.path,
                        JobApplication.serialize(app),
                    )
                    .pipe(map(JobApplication.normalize));
            }),
        );
    }

    updateApplications(apps: JobApplication[]): Observable<JobApplication[]> {
        return this.auth.isAuthenticated$.pipe(
            switchMap((isAuthenticated) => {
                if (!isAuthenticated) {
                    return this.updateLocalJobApplications(apps);
                }

                return this.apiService
                    .put<
                        JobApplicationDTO[]
                    >(this.path, apps.map(JobApplication.serialize))
                    .pipe(
                        map((updated) => updated.map(JobApplication.normalize)),
                    );
            }),
        );
    }

    private getLocalJobApplications(): JobApplication[] {
        const { jobApplications } = this.storage.getData();

        return jobApplications ?? [];
    }

    private createLocalJobApplication(
        jobApplication: JobApplication,
    ): Observable<JobApplication> {
        const jobApplications = this.getLocalJobApplications();
        jobApplication.id = String(jobApplications.length + 1);
        jobApplication.isNew = false;
        const date = new Date().toLocaleString();
        jobApplication.created = date;
        jobApplication.updated = date;
        this.storage.setData({
            jobApplications: [...jobApplications, jobApplication],
        });

        return of({ ...jobApplication });
    }

    private updateLocalJobApplications(
        jobApplications: JobApplication[],
    ): Observable<JobApplication[]> {
        const currentApplications = this.getLocalJobApplications();
        const date = new Date().toLocaleString();
        const appsToUpdateMap = new Map<string, JobApplication>();
        jobApplications.forEach((app: JobApplication) => {
            if (app.id) {
                appsToUpdateMap.set(app.id, { ...app, updated: date });
            }
        });
        this.storage.setData({
            jobApplications: currentApplications.map((app) => {
                if (app.id && appsToUpdateMap.has(app.id)) {
                    return {
                        ...appsToUpdateMap.get(app.id),
                        updated: date,
                    } as JobApplication;
                }

                return app;
            }),
        });

        return of(Array.from(appsToUpdateMap.values()));
    }
}
