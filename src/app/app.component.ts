import {
    Component,
    inject,
    OnInit
} from '@angular/core';
import { ActivationEnd, Route, Router, RouterOutlet } from '@angular/router';
import { MatListItem, MatNavList } from '@angular/material/list';
import {
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent
} from '@angular/material/sidenav';
import { filter } from 'rxjs';

import { HeaderComponent } from '@components/app-header';
import { ThemeService } from '@core/services';

import { sidenavRoutes } from './app.routes';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatNavList,
        MatListItem,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        HeaderComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class App implements OnInit {
    sidenavOpen = false;
    title = '';
    sidenavRoutes: Route[];

    private router = inject(Router);
    private themeService = inject(ThemeService)

    constructor() {
        this.sidenavRoutes = sidenavRoutes;
    }

    ngOnInit(): void {
        this.themeService.loadAndApplyTheme();
        this.router.events.pipe(
            filter((e): e is ActivationEnd => e instanceof ActivationEnd)
        ).subscribe(({ snapshot }) => {
            const title = snapshot.routeConfig?.title ?? '';
            this.title = title as string;
        });
    }

    onNavClick({ path }: Route): void {
        this.router.navigate([path]);
    }

    toggleSidenav(): void {
        this.sidenavOpen = !this.sidenavOpen;
    }
}
