import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FlipBookComponent } from './components/flip-book/flip-book.component';
import { SlidePuzzleComponent } from './components/slide-puzzle/slide-puzzle.component';

type Feature = 'flip-book' | 'slide-puzzle';

@Component({
    templateUrl: './bandits-corner.component.html',
    styleUrl: './bandits-corner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatSelectModule, FlipBookComponent, SlidePuzzleComponent],
})
export class BanditsCornerComponent {
    features: { value: Feature; label: string }[] = [
        { value: 'flip-book', label: 'Flip Book' },
        { value: 'slide-puzzle', label: 'Slide Puzzle' },
    ];

    activeFeature = signal<Feature>('flip-book');
}
