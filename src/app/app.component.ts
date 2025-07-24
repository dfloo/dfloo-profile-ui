import {
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { ActivationEnd, Route, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs';

import { HeaderComponent } from '@components/app-header';
import { sidenavRoutes } from './app.routes';

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
export class App implements OnInit {
    sidenavOpen = signal(false);
    title = signal('');
    sidenavRoutes: Route[];

    private router = inject(Router);

    constructor() {
        this.sidenavRoutes = sidenavRoutes;
    }

    ngOnInit(): void {
        this.router.events.pipe(
            filter((e): e is ActivationEnd => e instanceof ActivationEnd)
        ).subscribe(({ snapshot }) => {
            const title = snapshot.routeConfig?.title ?? '';
            this.title.set(title as string);
        });
    }

    onNavClick({ path }: Route): void {
        this.router.navigate([path]);
    }
}
