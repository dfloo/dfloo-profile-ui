import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable, of, switchMap } from 'rxjs';

import { Profile, ProfileDTO } from '@models/profile';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private apiService = inject(ApiService);
    private auth = inject(AuthService);
    private path = 'profiles';

    getUserProfile(): Observable<Profile> {
        return this.auth.isAuthenticated$.pipe(
            switchMap((isAuthenticated) => {
                if (!isAuthenticated) {
                    return of(new Profile({ firstName: 'Guest' }));
                }

                return this.apiService
                    .get<ProfileDTO>(this.path)
                    .pipe(map(Profile.normalize));
            }),
        );
    }

    createUserProfile(profile: Profile): Observable<Profile> {
        return this.apiService
            .post<ProfileDTO>(this.path, Profile.serialize(profile))
            .pipe(map(Profile.normalize));
    }

    updateUserProfile(profile: Profile): Observable<Profile> {
        return this.apiService
            .put<ProfileDTO>(this.path, Profile.serialize(profile))
            .pipe(map(Profile.normalize));
    }
}
