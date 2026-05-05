import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

export interface InvitationRequest {
    name: string;
    email: string;
    reason: string;
}

@Injectable({
    providedIn: 'root',
})
export class InvitationRequestService {
    private apiService = inject(ApiService);

    createInvitationRequest(req: InvitationRequest): Observable<void> {
        return this.apiService.post('invitation-requests', req);
    }
}
