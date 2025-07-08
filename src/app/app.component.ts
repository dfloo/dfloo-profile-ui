import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { HeaderComponent } from '@components/app-header';
import { navigableRoutes } from './app.routes';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatButtonModule,
        MatSidenavModule,
        HeaderComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class App {
    sidenavOpen: WritableSignal<boolean>;
    activeRouteTitle: WritableSignal<string>;
    navigableRoutes: Array<Route>;

    private router = inject(Router)

    constructor() {
        this.sidenavOpen = signal(false);
        this.activeRouteTitle = signal('Welcome');
        this.navigableRoutes = navigableRoutes;
    }

    onNavClick({ path, title }: Route): void {
        this.router.navigate([path]);
        this.activeRouteTitle.set(title as string);
    }
}
