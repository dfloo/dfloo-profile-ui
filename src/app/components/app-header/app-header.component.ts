import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Observable } from 'rxjs';

import { UserService } from '@core/services';
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
        AsyncPipe,
    ],
})
export class HeaderComponent {
    sidenavOpen = input(false);
    title = input('');
    toggleSidenav = output();

    isAuthenticated$: Observable<boolean>;
    UserModalView = UserModalView;
    profilePictureUrl$: Observable<string | undefined>;
    private userService = inject(UserService);
    private dialog = inject(MatDialog);

    constructor() {
        this.isAuthenticated$ = this.userService.isAuthenticated$;
        this.profilePictureUrl$ = this.userService.profilePictureUrl$;
    }

    login(): void {
        this.userService.login();
    }

    logout(): void {
        this.userService.logout();
    }

    signup(): void {
        this.userService.signup();
    }

    openUserModal(view: UserModalView, showTabs = true): void {
        this.dialog.open(UserModalComponent, {
            minHeight: '75vh',
            minWidth: '65vw',
            data: { view, showTabs },
        });
    }
}
