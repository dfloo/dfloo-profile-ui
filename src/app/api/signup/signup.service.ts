import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

export interface SignupRequest {
    name: string;
    email: string;
    reason: string;
}

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    private apiService = inject(ApiService);

    createSignupRequest(req: SignupRequest): Observable<void> {
        return this.apiService.post('invitation-requests', req);
    }
}
