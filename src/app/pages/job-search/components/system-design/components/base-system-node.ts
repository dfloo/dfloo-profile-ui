import { NodePoint, SystemComponentType } from './system-node.types';

export abstract class BaseSystemNode {
    constructor(
        public readonly id: number,
        public readonly type: SystemComponentType,
        public x: number,
        public y: number,
        public readonly width = 140,
        public readonly height = 140,
    ) { }

    get center(): NodePoint {
        return this.getCenterAt({ x: this.x, y: this.y });
    }

    get label(): string {
        return this.type;
    }

    moveTo({ x, y }: NodePoint): void {
        this.x = x;
        this.y = y;
    }

    getCenterAt(position: NodePoint): NodePoint {
        return {
            x: position.x + this.width / 2,
            y: position.y + this.height / 2,
        };
    }

    getAnchorToward(target: BaseSystemNode): NodePoint {
        return this.getAnchorTowardAt(
            target,
            { x: this.x, y: this.y },
            { x: target.x, y: target.y },
        );
    }

    getAnchorTowardAt(
        target: BaseSystemNode,
        selfPosition: NodePoint,
        targetPosition: NodePoint,
    ): NodePoint {
        const current = this.getCenterAt(selfPosition);
        const other = target.getCenterAt(targetPosition);
        const dx = other.x - current.x;
        const dy = other.y - current.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            return {
                x: dx >= 0
                    ? selfPosition.x + this.width
                    : selfPosition.x,
                y: current.y,
            };
        }

        return {
            x: current.x,
            y: dy >= 0
                ? selfPosition.y + this.height
                : selfPosition.y,
        };
    }
}
