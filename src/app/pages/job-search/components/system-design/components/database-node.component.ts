import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BaseSystemNode } from './base-system-node';

@Component({
    selector: 'system-database-node',
    template: `
        <div class="node-card" [class.is-selected]="selected()">
            <div class="node-type">Database</div>
            <div class="node-label">{{ node().label }}</div>
        </div>
    `,
    styles: [
        `
            .node-card {
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 0.2rem;
            }

            .node-type {
                font: var(--mat-sys-label-medium);
                color: var(--mat-sys-primary);
                text-transform: uppercase;
                letter-spacing: 0.03em;
            }

            .node-label {
                font: var(--mat-sys-title-small);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabaseNodeComponent {
    node = input.required<BaseSystemNode>();
    selected = input(false);
}
