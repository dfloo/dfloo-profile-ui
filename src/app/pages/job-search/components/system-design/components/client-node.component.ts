import {
    ChangeDetectionStrategy,
    Component,
    input,
    signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { BaseSystemNode } from './base-system-node';

@Component({
    selector: 'system-client-node',
    template: `
        <div class="node-card" [class.is-selected]="selected()">
            <mat-icon
                class="device-icon"
                (click)="$event.stopPropagation()"
                (dblclick)="toggleDeviceIcon($event)"
            >
                {{ isMobile() ? 'smartphone' : 'desktop_windows' }}
            </mat-icon>
        </div>
    `,
    styles: [
        `
            .node-card {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .device-icon {
                cursor: pointer;
                font-size: 36px;
                width: 36px;
                height: 36px;
                line-height: 36px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon],
})
export class ClientNodeComponent {
    node = input.required<BaseSystemNode>();
    selected = input(false);
    isMobile = signal(false);

    toggleDeviceIcon(event: MouseEvent): void {
        event.stopPropagation();
        this.isMobile.update((isMobile) => !isMobile);
    }
}
