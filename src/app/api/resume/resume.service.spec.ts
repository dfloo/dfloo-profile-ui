import { TestBed } from '@angular/core/testing';

import { ResumeService } from './resume.service';
import { ApiService } from '@api/api.service';

describe('ResumeService', () => {
    let service: ResumeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ApiService,
                    useValue: {
                        get: jasmine.createSpy('get'),
                        delete: jasmine.createSpy('delete')
                    }
                }
            ]
        });
        service = TestBed.inject(ResumeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
