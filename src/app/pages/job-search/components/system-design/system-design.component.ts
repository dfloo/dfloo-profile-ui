import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

type SystemComponentType = 'Client' | 'Server' | 'Database';

interface CanvasNode {
    id: number;
    type: SystemComponentType;
    x: number;
    y: number;
}

@Component({
    selector: 'system-design',
    templateUrl: './system-design.component.html',
    styleUrl: './system-design.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDrag, MatButton, MatMenu, MatMenuItem, MatMenuTrigger],
})
export class SystemDesignComponent {
    componentTypes: SystemComponentType[] = ['Client', 'Server', 'Database'];
    nodes = signal<CanvasNode[]>([]);
    private nextNodeId = 1;

    addNode(type: SystemComponentType): void {
        const offset = (this.nextNodeId - 1) * 16;
        const node: CanvasNode = {
            id: this.nextNodeId,
            type,
            x: 24 + offset,
            y: 24 + offset,
        };

        this.nextNodeId += 1;
        this.nodes.update((nodes) => [...nodes, node]);
    }

    updateNodePosition(nodeId: number, event: CdkDragEnd): void {
        const { x, y } = event.source.getFreeDragPosition();
        this.nodes.update((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, x, y };
                }

                return node;
            }),
        );
    }
}