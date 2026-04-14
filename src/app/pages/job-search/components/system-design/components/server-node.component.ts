import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { BaseSystemNode } from './base-system-node';

@Component({
    selector: 'system-server-node',
    template: `
        <div class="node-card" [class.is-selected]="selected()">
            <mat-icon class="node-icon">dns</mat-icon>
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

            .node-icon {
                font-size: 32px;
                width: 32px;
                height: 32px;
                line-height: 32px;
                color: var(--mat-sys-primary);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon],
})
export class ServerNodeComponent {
    node = input.required<BaseSystemNode>();
    selected = input(false);
}
