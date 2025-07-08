import {
    ChangeDetectionStrategy,
    Component,
    Input,
    WritableSignal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-header',
    imports: [MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './app-header.component.html',
    styleUrl: './app-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    @Input() sidenavOpen!: WritableSignal<boolean>;
    @Input() activeRouteTitle!: WritableSignal<string>;

    toggleSidenav() {
        this.sidenavOpen.set(!this.sidenavOpen());
    }
}
