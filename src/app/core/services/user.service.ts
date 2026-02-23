import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private auth = inject(AuthService);
    private doc = inject(DOCUMENT);
    private namespace = 'http://dfloo-profile.com';

    isAuthenticated$ = this.auth.isAuthenticated$;
    user$ = this.auth.user$;
    profilePictureUrl$ = this.user$.pipe(map((user) => user?.picture));

    login(): void {
        this.auth.loginWithPopup();
    }

    signup(): void {
        this.auth.loginWithPopup({
            authorizationParams: { screen_hint: 'signup' },
        });
    }

    logout(): void {
        this.auth.logout({
            logoutParams: { returnTo: this.doc.location.origin },
        });
    }

    hasRole(role: Role): Observable<boolean> {
        return this.user$.pipe(
            map((user) => {
                if (!user) return false;

                const roles: Role[] = user[`${this.namespace}/roles`];

                return roles?.includes(role);
            }),
        );
    }
}

export enum Role {
    SuperUser = 'Super User',
}
