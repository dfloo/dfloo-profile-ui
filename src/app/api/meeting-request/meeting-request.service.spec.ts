import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../api.service';
import { MeetingRequest, MeetingRequestService } from './meeting-request.service';

describe('MeetingRequestService', () => {
    let service: MeetingRequestService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['post']);
        TestBed.configureTestingModule({
            providers: [{ provide: ApiService, useValue: mockApiService }],
        });
        service = TestBed.inject(MeetingRequestService);
    });

    it('#createMeetingRequest should POST to meeting-requests with the request body', (done) => {
        const req: MeetingRequest = { name: 'Test User', email: 'test@example.com', message: 'Let us connect' };
        mockApiService.post.and.returnValue(of(undefined));

        service.createMeetingRequest(req).subscribe(() => {
            expect(mockApiService.post).toHaveBeenCalledWith('meeting-requests', req);
            done();
        });
    });
});
