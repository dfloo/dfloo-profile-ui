import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
    Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import {
    BaseSystemNode,
    ClientNodeComponent,
    createSystemNode,
    DatabaseNodeComponent,
    ServerNodeComponent,
    SystemComponentType,
    SystemNodeEdge,
} from './components';

interface RenderedEdge {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

@Component({
    selector: 'system-design',
    templateUrl: './system-design.component.html',
    styleUrl: './system-design.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CdkDrag,
        MatButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        NgComponentOutlet,
    ],
})
export class SystemDesignComponent {
    componentTypes: SystemComponentType[] = ['Client', 'Server', 'Database'];
    nodes = signal<BaseSystemNode[]>([]);
    edges = signal<SystemNodeEdge[]>([]);
    selectedSourceId = signal<number | null>(null);

    presenterByType: Record<SystemComponentType, Type<unknown>> = {
        Client: ClientNodeComponent,
        Server: ServerNodeComponent,
        Database: DatabaseNodeComponent,
    };

    renderedEdges = computed<RenderedEdge[]>(() => {
        const nodeMap = new Map(this.nodes().map((node) => [node.id, node]));

        return this.edges()
            .map((edge) => {
                const source = nodeMap.get(edge.sourceId);
                const target = nodeMap.get(edge.targetId);

                if (!source || !target) {
                    return null;
                }

                const sourceAnchor = source.getAnchorToward(target);
                const targetAnchor = target.getAnchorToward(source);

                return {
                    id: edge.id,
                    x1: sourceAnchor.x,
                    y1: sourceAnchor.y,
                    x2: targetAnchor.x,
                    y2: targetAnchor.y,
                };
            })
            .filter((edge): edge is RenderedEdge => !!edge);
    });

    private nextNodeId = 1;

    addNode(type: SystemComponentType): void {
        const offset = (this.nextNodeId - 1) * 16;
        const node = createSystemNode(
            type,
            this.nextNodeId,
            24 + offset,
            24 + offset,
        );

        this.nextNodeId += 1;
        this.nodes.update((nodes) => [...nodes, node]);
    }

    updateNodePosition(nodeId: number, event: CdkDragEnd): void {
        const { x, y } = event.source.getFreeDragPosition();
        this.nodes.update((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    node.moveTo({ x, y });
                }

                return node;
            }),
        );
    }

    onNodeClick(nodeId: number): void {
        const sourceId = this.selectedSourceId();

        if (!sourceId) {
            return;
        }

        this.completeConnection(sourceId, nodeId);
    }

    onConnectorSourceClick(nodeId: number, event: MouseEvent): void {
        event.stopPropagation();
        const sourceId = this.selectedSourceId();

        if (!sourceId) {
            this.selectedSourceId.set(nodeId);

            return;
        }

        if (sourceId === nodeId) {
            this.selectedSourceId.set(null);

            return;
        }

        this.completeConnection(sourceId, nodeId);
    }

    deleteConnection(edgeId: string, event: MouseEvent): void {
        event.stopPropagation();
        this.edges.update((edges) => edges.filter((edge) => edge.id !== edgeId));
    }

    private completeConnection(sourceId: number, targetId: number): void {
        if (sourceId === targetId) {
            this.selectedSourceId.set(null);

            return;
        }

        const edgeId = this.getEdgeId(sourceId, targetId);

        this.edges.update((edges) => {
            if (edges.some((edge) => edge.id === edgeId)) {
                return edges;
            }

            return [
                ...edges,
                {
                    id: edgeId,
                    sourceId,
                    targetId,
                },
            ];
        });
        this.selectedSourceId.set(null);
    }

    private getEdgeId(sourceId: number, targetId: number): string {
        return `${sourceId}->${targetId}`;
    }
}