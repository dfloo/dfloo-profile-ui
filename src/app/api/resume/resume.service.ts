import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SessionStorageService } from '@core/services';
import { Resume, ResumeDTO } from '@models/resume';

import { ApiService } from '../api.service';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private apiService = inject(ApiService);
    private auth = inject(AuthService);
    private storage = inject(SessionStorageService);
    private path = 'resumes';
    
    getResumes(): Observable<Resume[]> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
                    return of(this.getSessionResumes());
                }

                return this.apiService.get<ResumeDTO[]>(this.path).pipe(
                    map(resumes => (resumes?.map(Resume.normalize) ?? []))
                );
            })
        );
    }
    
    deleteResumes(resumeIDs: string[]): Observable<unknown> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
                    return this.deleteSessionResumes(resumeIDs);
                }

                return this.apiService.delete(this.path, resumeIDs);
            })
        );
    }

    createResume(resume: Resume): Observable<Resume> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenitcated => {
                if (!isAuthenitcated) {
                    return this.createSessionResume(resume);
                }

                return this.apiService
                    .post<ResumeDTO>(this.path, Resume.serialize(resume))
                    .pipe(map(Resume.normalize));
            })
        );
    }

    updateResume(resume: Resume): Observable<Resume> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenitcated => {
                if (!isAuthenitcated) {
                    return this.updateSessionResume(resume);
                }

                return this.apiService
                    .put<ResumeDTO>(this.path, Resume.serialize(resume))
                    .pipe(map(Resume.normalize));
            })
        );
    }

    downloadResume(resume: Resume): Observable<Blob> {
        return this.apiService.download<Blob>(
            'download/resume',
            Resume.serialize(resume)
        );
    }

    private getSessionResumes(): Resume[] {
        const { resumes } = this.storage.getData();
        
        return resumes ?? [];
    }

    private deleteSessionResumes(resumeIDs: string[]): Observable<boolean> {
        const resumes = this.getSessionResumes();
        this.storage.setData({
            resumes: resumes.filter(resume => {
                return resume.id && !resumeIDs.includes(resume.id);
            })
        })
        
        return of(true);
    }

    private createSessionResume(resume: Resume): Observable<Resume> {
        const resumes = this.getSessionResumes();
        resume.id = String(resumes.length + 1);
        resume.isNew = false;
        const date = new Date().toLocaleString();
        resume.created = date;
        resume.updated = date;
        this.storage.setData({ resumes: [...resumes, resume] });

        return of(cloneDeep(resume));
    }

    private updateSessionResume(resume: Resume): Observable<Resume> {
        const resumes = this.getSessionResumes();
        resume.updated = new Date().toLocaleString();
        this.storage.setData({
            resumes: resumes.map(r => (r.id === resume.id ? resume : r))
        });

        return of(cloneDeep(resume));
    }
}
