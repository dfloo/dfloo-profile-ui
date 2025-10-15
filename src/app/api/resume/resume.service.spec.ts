import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { SessionStorageService } from '@core/services';
import { Resume } from '@models/resume';

import { ApiService } from '../api.service';
import { ResumeService } from './resume.service';

describe('ResumeService', () => {
    let service: ResumeService;
    let mockApiService: jasmine.SpyObj<ApiService>;
    let mockSessionStorage: jasmine.SpyObj<SessionStorageService>;
    const AUTH0_CLIENT = new InjectionToken('auth0.client');

    const setup = (isAuthenticated = true) => {
        mockApiService = jasmine.createSpyObj(
            'ApiService',
            ['get', 'put', 'post', 'delete', 'download']
        );
        mockSessionStorage = jasmine.createSpyObj(
            'SessionStorageService',
            ['getData', 'setData']
        );
        TestBed.configureTestingModule({
            providers: [
                { provide: AUTH0_CLIENT, useValue: {} },
                {
                    provide: AuthService,
                    useValue: { isAuthenticated$: of(isAuthenticated) }
                },
                { provide: ApiService, useValue: mockApiService },
                { provide: SessionStorageService, useValue: mockSessionStorage }
            ]
        });
        service = TestBed.inject(ResumeService);
    }

    describe('#getResumes', () => {
        it('should make a get request and normalize result', done => {
            setup();
            const mockDTO = Resume.getMockDTO('id');
            const normalized = Resume.normalize(mockDTO);
            mockApiService.get.and.returnValue(of([mockDTO]));

            service.getResumes().subscribe(resumes => {
                expect(mockApiService.get).toHaveBeenCalledWith('resumes');
                expect(resumes).toEqual([normalized])
                done();
            });

        });

        it('should get from session storage for unauthenticated user', done => {
            setup(false);
            const mockResumes = [Resume.normalize(Resume.getMockDTO('id'))];
            mockSessionStorage.getData.and.returnValue(
                { resumes: mockResumes }
            );

            service.getResumes().subscribe(resumes => {
                expect(mockApiService.get).not.toHaveBeenCalled();
                expect(mockSessionStorage.getData).toHaveBeenCalled();
                expect(resumes).toEqual(mockResumes);
                done();
            });
        });
    });

    describe('#deleteResumes', () => {
        it('should make a delete request', done => {
            setup();
            mockApiService.delete.and.returnValue(of(true));

            service.deleteResumes(['id']).subscribe(result => {
                expect(result).toBeTrue();
                expect(mockApiService.delete).toHaveBeenCalledWith(
                    'resumes',
                    ['id']
                );
                done();
            });

        });

        it("should delete from session storage for unauth'd user", done => {
            setup(false);
            mockSessionStorage.getData.and.returnValue(
                { resumes: [Resume.normalize(Resume.getMockDTO('id'))] }
            );
            service.deleteResumes(['id']).subscribe(result => {
                expect(result).toEqual(true);
                expect(mockApiService.delete).not.toHaveBeenCalled();
                expect(mockSessionStorage.setData).toHaveBeenCalledWith({
                    resumes: []
                });
                done();
            });
            
        });
    });

    describe('#createResume', () => {
        it('should post serialized resume and normalize result', done => {
            setup();
            const mockDTO = Resume.getMockDTO('id')
            const normalized = Resume.normalize(mockDTO);
            const serialized = Resume.serialize(normalized);
            mockApiService.post.and.returnValue(of(mockDTO));

            service.createResume(normalized).subscribe(created => {
                expect(created).toEqual(normalized);
                expect(mockApiService.post).toHaveBeenCalledWith(
                    'resumes',
                    serialized
                );
                done();
            });

        });

        it('should add to session storage for unauthenticated user', done => {
            setup(false);
            mockSessionStorage.getData.and.returnValue({ resumes: [] });
            const resume = new Resume({});

            service.createResume(resume).subscribe(created => {
                expect(created).toEqual(resume);
                expect(mockApiService.post).not.toHaveBeenCalled();
                expect(mockSessionStorage.setData).toHaveBeenCalledWith({
                    resumes: [resume]
                });
                done();
            });

        });
    });

    describe('#updateResume', () => {
        it('should put serialized resume and normalize result', done => {
            setup();
            const mockDTO = Resume.getMockDTO('id');
            const normalized = Resume.normalize(mockDTO);
            const serialized = Resume.serialize(normalized);
            mockApiService.put.and.returnValue(of(mockDTO));

            service.updateResume(normalized).subscribe(updated => {
                expect(updated).toEqual(normalized);
                expect(mockApiService.put).toHaveBeenCalledWith(
                    'resumes',
                    serialized
                );
                done();
            });
        });

        it("should edit session storage for unauth'd users", done => {
            setup(false);
            const existing = Resume.normalize(Resume.getMockDTO('id'));
            mockSessionStorage.getData.and.returnValue({ resumes: [existing] });
            const updated = new Resume({ ...existing, summary: 'updated' });

            service.updateResume(updated).subscribe(result => {
                expect(result).toEqual(updated);
                expect(mockApiService.put).not.toHaveBeenCalled();
                expect(mockSessionStorage.setData).toHaveBeenCalledWith({
                    resumes: [updated]
                });
                done();
            });
        });
    });

    it('#downloadResume serialize and download the resume', () => {
        setup();
        const resume = new Resume({});
        service.downloadResume(resume);

        expect(mockApiService.download).toHaveBeenCalledWith(
            'download/resume',
            Resume.serialize(resume)
        );
    });
});
