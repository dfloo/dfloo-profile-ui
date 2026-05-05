import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

export interface MeetingRequest {
    name: string;
    email: string;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class MeetingRequestService {
    private apiService = inject(ApiService);

    createMeetingRequest(req: MeetingRequest): Observable<void> {
        return this.apiService.post('meeting-requests', req);
    }
}
