import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    output
} from '@angular/core';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar'
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

import { UserModalComponent, UserModalView } from '@components/user-modal';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrl: './app-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIconButton,
        MatIcon,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatToolbar,
        AsyncPipe
    ]
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
            logoutParams: { returnTo: this.doc.location.origin }
        });
    }

    signup(): void {
        this.auth.loginWithPopup({
            authorizationParams: { screen_hint: 'signup', },
        });
    }

    openUserModal(view: UserModalView, showTabs = true): void {
        this.dialog.open(UserModalComponent, {
            minHeight: '50vh',
            minWidth: '60vw',
            data: { view, showTabs }
        });
    }
}
