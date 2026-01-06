import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FlipBookComponent } from './components';

@Component({
    templateUrl: './bandits-story.component.html',
    styleUrl: './bandits-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FlipBookComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BanditsStoryComponent {}
