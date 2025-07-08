import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Resume, ResumeDTO } from '@models/resume';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private apiService = inject(ApiService)

    getResume(): Observable<Resume> {
        return this.apiService.get<ResumeDTO>('/resume')
            .pipe(map(Resume.normalize))
    }
}
