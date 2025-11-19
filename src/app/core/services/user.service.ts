import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private auth = inject(AuthService);
    private namespace = 'http://dfloo-profile.com';

    hasRole(role: Role): Observable<boolean> {
        return this.auth.user$.pipe(map(user => {
            if (!user) return false;

            const roles: Role[] = user[`${this.namespace}/roles`];

            return roles?.includes(role);
        }))
    }
}

export enum Role {
    SuperUser = 'Super User'
}
