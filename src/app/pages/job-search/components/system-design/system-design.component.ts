import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
    Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
    MessageDialogComponent,
    MessageDialogResult,
} from '@components/message-dialog';

import {
    BaseSystemNode,
    ClientNodeComponent,
    createSystemNode,
    DatabaseNodeComponent,
    NodePoint,
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
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        NgComponentOutlet,
    ],
})
export class SystemDesignComponent {
    private dialog = inject(MatDialog);

    componentTypes: SystemComponentType[] = ['Client', 'Server', 'Database'];
    nodes = signal<BaseSystemNode[]>([]);
    edges = signal<SystemNodeEdge[]>([]);
    selectedSourceId = signal<number | null>(null);
    draggingNodeId = signal<number | null>(null);
    draggingNodePosition = signal<NodePoint | null>(null);

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

                const sourcePosition = this.getEffectiveNodePosition(source);
                const targetPosition = this.getEffectiveNodePosition(target);

                const sourceAnchor = this.getAnchorToward(
                    source,
                    target,
                    sourcePosition,
                    targetPosition,
                );
                const targetAnchor = this.getAnchorToward(
                    target,
                    source,
                    targetPosition,
                    sourcePosition,
                );

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
        const position = event.source.getFreeDragPosition();
        this.nodes.update((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    node.moveTo(position);
                }

                return node;
            }),
        );
        if (this.draggingNodeId() === nodeId) {
            this.draggingNodeId.set(null);
            this.draggingNodePosition.set(null);
        }
    }

    updateNodePositionDuringDrag(nodeId: number, event: CdkDragMove): void {
        const { x, y } = event.source.getFreeDragPosition();
        this.draggingNodeId.set(nodeId);
        this.draggingNodePosition.set({ x, y });
    }

    private getEffectiveNodePosition(node: BaseSystemNode): NodePoint {
        if (this.draggingNodeId() === node.id && this.draggingNodePosition()) {
            return this.draggingNodePosition() as NodePoint;
        }

        return { x: node.x, y: node.y };
    }

    private getAnchorToward(
        node: BaseSystemNode,
        target: BaseSystemNode,
        nodePosition: NodePoint,
        targetPosition: NodePoint,
    ): NodePoint {
        const currentCenter = {
            x: nodePosition.x + node.width / 2,
            y: nodePosition.y + node.height / 2,
        };
        const targetCenter = {
            x: targetPosition.x + target.width / 2,
            y: targetPosition.y + target.height / 2,
        };
        const dx = targetCenter.x - currentCenter.x;
        const dy = targetCenter.y - currentCenter.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            return {
                x: dx >= 0 ? nodePosition.x + node.width : nodePosition.x,
                y: currentCenter.y,
            };
        }

        return {
            x: currentCenter.x,
            y: dy >= 0 ? nodePosition.y + node.height : nodePosition.y,
        };
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

    clearAll(): void {
        if (!this.nodes().length && !this.edges().length) {
            return;
        }

        this.dialog
            .open(MessageDialogComponent, {
                data: {
                    message:
                        'Are you sure you want to delete all nodes and connections?',
                    confirmLabel: 'Delete All',
                    cancelLabel: 'Cancel',
                },
            })
            .afterClosed()
            .subscribe((result: MessageDialogResult | undefined) => {
                if (result === MessageDialogResult.Confirm) {
                    this.nodes.set([]);
                    this.edges.set([]);
                    this.selectedSourceId.set(null);
                    this.draggingNodeId.set(null);
                    this.draggingNodePosition.set(null);
                    this.nextNodeId = 1;
                }
            });
    }

    deleteNode(nodeId: number, event: MouseEvent): void {
        event.stopPropagation();

        this.dialog
            .open(MessageDialogComponent, {
                data: {
                    message:
                        'Are you sure you want to delete this node and its connections?',
                    confirmLabel: 'Delete Node',
                    cancelLabel: 'Cancel',
                },
            })
            .afterClosed()
            .subscribe((result: MessageDialogResult | undefined) => {
                if (result !== MessageDialogResult.Confirm) {
                    return;
                }

                this.nodes.update((nodes) =>
                    nodes.filter((node) => node.id !== nodeId),
                );
                this.edges.update((edges) =>
                    edges.filter(
                        (edge) =>
                            edge.sourceId !== nodeId && edge.targetId !== nodeId,
                    ),
                );

                if (this.selectedSourceId() === nodeId) {
                    this.selectedSourceId.set(null);
                }
                if (this.draggingNodeId() === nodeId) {
                    this.draggingNodeId.set(null);
                    this.draggingNodePosition.set(null);
                }
            });
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
        const a = Math.min(sourceId, targetId);
        const b = Math.max(sourceId, targetId);

        return `${a}-${b}`;
    }
}