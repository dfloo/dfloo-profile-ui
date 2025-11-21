import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import cloneDeep from 'lodash-es/cloneDeep';
import { map, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SessionStorageService } from '@core/services';
import { Resume, ResumeDTO } from '@models/resume';

import { ApiService } from '../api.service';

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

    setDefaultResume(resumeId: string): Observable<Map<string, Resume>> {
        return this.apiService.put<ResumeDTO[]>(
            `${this.path}/default`,
            { resumeId }
        ).pipe(map(resumes => {
            const updatedMap = new Map<string, Resume>();
            resumes?.map(Resume.normalize)?.forEach(resume => {
                if (!resume.id) return;

                updatedMap.set(resume.id, resume);
            });

            return updatedMap;
        }));
    }

    deleteResumes(resumeIds: string[]): Observable<string[]> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
                    return this.deleteSessionResumes(resumeIds);
                }

                return this.apiService.delete<string[]>(this.path, resumeIds);
            })
        );
    }

    createResume(resume: Resume): Observable<Resume> {
        return this.auth.isAuthenticated$.pipe(
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
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
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
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

    downloadDefaultResume(): Observable<Blob> {
        return this.apiService.download<Blob>('download/resume/default');
    }

    private getSessionResumes(): Resume[] {
        const { resumes } = this.storage.getData();
        
        return resumes ?? [];
    }

    private deleteSessionResumes(resumeIds: string[]): Observable<string[]> {
        const resumes = this.getSessionResumes();
        this.storage.setData({
            resumes: resumes.filter(resume => {
                return resume.id && !resumeIds.includes(resume.id);
            })
        })
        
        return of(resumeIds);
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
