import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    JobApplication,
    JobApplicationDTO
} from '@models/job-application';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private apiService = inject(ApiService);
    private path = 'job-applications';
    
    getJobApplications(): Observable<JobApplication[]> {
        return this.apiService.get<JobApplicationDTO[]>(this.path)
            .pipe(map(apps => {
                return apps?.map(JobApplication.normalize)
                    .sort((a, b) => a.sortIndex - b.sortIndex) ?? [];
            }));
    }

    createJobApplication(app: JobApplication): Observable<JobApplication> {
        return this.apiService.post<JobApplicationDTO>(
            this.path,
            JobApplication.serialize(app)
        ).pipe(map(JobApplication.normalize));
    }

    updateApplications(apps: JobApplication[]): Observable<JobApplication[]> {
        return this.apiService.put<JobApplicationDTO[]>(
            this.path,
            apps.map(JobApplication.serialize)
        ).pipe(map(updated => updated.map(JobApplication.normalize)));
    }
}
