import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../api.service';
import { SignupRequest, SignupService } from './signup.service';

describe('SignupService', () => {
    let service: SignupService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['post']);
        TestBed.configureTestingModule({
            providers: [{ provide: ApiService, useValue: mockApiService }],
        });
        service = TestBed.inject(SignupService);
    });

    it('#createSignupRequest should POST to invitation-requests with the request body', (done) => {
        const req: SignupRequest = { name: 'Test User', email: 'test@example.com', reason: 'I want access' };
        mockApiService.post.and.returnValue(of(undefined));

        service.createSignupRequest(req).subscribe(() => {
            expect(mockApiService.post).toHaveBeenCalledWith('invitation-requests', req);
            done();
        });
    });
});
