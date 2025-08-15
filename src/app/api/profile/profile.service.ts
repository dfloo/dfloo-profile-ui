import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Profile, ProfileDTO } from '@models/profile';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiService = inject(ApiService);
    private path = 'profile';

    getProfile(): Observable<Profile> {
        return this.apiService.get<ProfileDTO>(this.path)
            .pipe(map(Profile.normalize));
    }

    createProfile(profile: Profile): Observable<Profile> {
        return this.apiService.post(this.path, Profile.serialize(profile))
            .pipe(map(Profile.normalize));
    }

    updateProfile(profile: Profile): Observable<Profile> {
        return this.apiService.put(this.path, Profile.serialize(profile))
            .pipe(map(Profile.normalize));
    }
}