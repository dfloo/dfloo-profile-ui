import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Resume, ResumeDTO } from '@models/resume';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private apiService = inject(ApiService)

    getResumes(): Observable<Resume[]> {
        return this.apiService.get<ResumeDTO[]>('/resumes')
            .pipe(map(resumes => resumes.map(Resume.normalize)))
    }
}
