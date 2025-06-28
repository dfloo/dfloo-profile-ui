import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { HeaderComponent } from '@components/app-header';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatSidenavModule,
        HeaderComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class App {
    sidenavOpen: WritableSignal<boolean>;

    constructor() {
        this.sidenavOpen = signal(false);
    }
}
