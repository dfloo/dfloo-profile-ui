import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    output
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { UserModalComponent, UserModalView } from '@components/user-modal';

@Component({
    selector: 'app-header',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        AsyncPipe
    ],
    templateUrl: './app-header.component.html',
    styleUrl: './app-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
    sidenavOpen = input(false);
    title = input('');
    toggleSidenav = output();

    isAuthenticated$?: Observable<boolean>;
    UserModalView = UserModalView;

    private dialog = inject(MatDialog);
    private auth = inject(AuthService);
    private doc = inject(DOCUMENT);

    ngOnInit(): void {
        this.isAuthenticated$ = this.auth.isAuthenticated$
    }

    login(): void {
        this.auth.loginWithPopup();
    }

    logout(): void {
        this.auth.logout({
            logoutParams: { returnTo: this.doc.location.origin, },
        });
    }

    signup(): void {
        this.auth.loginWithPopup({
            authorizationParams: { screen_hint: 'signup', },
        });
    }

    openUserModal(view: UserModalView): void {
        this.dialog.open(UserModalComponent, {
            minHeight: '50vh',
            minWidth: '60vw',
            data: { view }
        });
    }
}
