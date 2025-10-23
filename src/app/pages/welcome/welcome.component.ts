import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlipBookComponent } from "./components/flip-book/flip-book.component";

@Component({
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FlipBookComponent]
})
export class WelcomeComponent {
    
}
