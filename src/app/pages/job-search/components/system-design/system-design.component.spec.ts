import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { MessageDialogComponent, MessageDialogResult } from '@components/message-dialog';

import { SystemDesignComponent } from './system-design.component';

describe('SystemDesignComponent', () => {
    let component: SystemDesignComponent;
    let fixture: ComponentFixture<SystemDesignComponent>;
    let mockDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [SystemDesignComponent],
            providers: [{ provide: MatDialog, useValue: mockDialog }],
        }).compileComponents();

        fixture = TestBed.createComponent(SystemDesignComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const createMoveEvent = (x: number, y: number): CdkDragMove => {
        return {
            source: {
                getFreeDragPosition: () => ({ x, y }),
            },
        } as unknown as CdkDragMove;
    };

    const createEndEvent = (x: number, y: number): CdkDragEnd => {
        return {
            source: {
                getFreeDragPosition: () => ({ x, y }),
            },
        } as unknown as CdkDragEnd;
    };

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addNode should create client nodes by default with incremental offsets', () => {
        component.addNode();
        component.addNode();

        const [first, second] = component.nodes();
        expect(first.type).toBe('Client');
        expect(first.id).toBe(1);
        expect(first.x).toBe(24);
        expect(first.y).toBe(24);

        expect(second.type).toBe('Client');
        expect(second.id).toBe(2);
        expect(second.x).toBe(40);
        expect(second.y).toBe(40);
    });

    it('changeNodeType should replace node type and preserve id and position', () => {
        component.addNode();
        const [node] = component.nodes();
        const event = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;

        component.changeNodeType(node.id, 'Server', event);

        const [updated] = component.nodes();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(updated.type).toBe('Server');
        expect(updated.id).toBe(node.id);
        expect(updated.x).toBe(node.x);
        expect(updated.y).toBe(node.y);
    });

    it('onConnectorSourceClick should create one connection and prevent duplicates for reversed order', () => {
        const event = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;

        component.addNode();
        component.addNode();
        const [first, second] = component.nodes();

        component.onConnectorSourceClick(first.id, event);
        component.onConnectorSourceClick(second.id, event);

        expect(component.edges().length).toBe(1);

        component.onConnectorSourceClick(second.id, event);
        component.onConnectorSourceClick(first.id, event);

        expect(component.edges().length).toBe(1);
    });

    it('updateNodePositionDuringDrag should update transient position and renderedEdges', () => {
        const event = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;

        component.addNode();
        component.addNode();
        const [first, second] = component.nodes();

        component.onConnectorSourceClick(first.id, event);
        component.onConnectorSourceClick(second.id, event);

        const initial = component.renderedEdges()[0];
        component.updateNodePositionDuringDrag(first.id, createMoveEvent(200, 200));
        const moved = component.renderedEdges()[0];

        expect(component.draggingNodeId()).toBe(first.id);
        expect(component.draggingNodePosition()).toEqual({ x: 200, y: 200 });
        expect(moved.x1).not.toBe(initial.x1);
        expect(moved.y1).not.toBe(initial.y1);
    });

    it('updateNodePosition should commit final position and clear transient dragging state', () => {
        component.addNode();
        const [node] = component.nodes();

        component.updateNodePositionDuringDrag(node.id, createMoveEvent(190, 210));
        component.updateNodePosition(node.id, createEndEvent(220, 260));

        const [updated] = component.nodes();
        expect(updated.x).toBe(220);
        expect(updated.y).toBe(260);
        expect(component.draggingNodeId()).toBeNull();
        expect(component.draggingNodePosition()).toBeNull();
    });

    it('clearAll should no-op when board is empty', () => {
        component.clearAll();

        expect(mockDialog.open).not.toHaveBeenCalled();
    });

    it('clearAll should remove nodes and edges when confirmation is accepted', () => {
        mockDialog.open.and.returnValue({
            afterClosed: () => of(MessageDialogResult.Confirm),
        } as MatDialogRef<MessageDialogComponent>);

        const event = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;
        component.addNode();
        component.addNode();
        const [first, second] = component.nodes();
        component.onConnectorSourceClick(first.id, event);
        component.onConnectorSourceClick(second.id, event);

        component.clearAll();

        expect(component.nodes()).toEqual([]);
        expect(component.edges()).toEqual([]);

        component.addNode();
        expect(component.nodes()[0].id).toBe(1);
    });

    it('deleteNode should remove the target node and its edges when confirmed', () => {
        mockDialog.open.and.returnValue({
            afterClosed: () => of(MessageDialogResult.Confirm),
        } as MatDialogRef<MessageDialogComponent>);

        const connectorEvent = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;
        const deleteEvent = { stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;

        component.addNode();
        component.addNode();
        const [first, second] = component.nodes();

        component.onConnectorSourceClick(first.id, connectorEvent);
        component.onConnectorSourceClick(second.id, connectorEvent);

        component.deleteNode(first.id, deleteEvent);

        expect(deleteEvent.stopPropagation).toHaveBeenCalled();
        expect(component.nodes().map((n) => n.id)).toEqual([second.id]);
        expect(component.edges().length).toBe(0);
    });
});
