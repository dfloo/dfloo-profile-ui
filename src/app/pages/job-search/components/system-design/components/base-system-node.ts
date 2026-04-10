import { NodePoint, SystemComponentType } from './system-node.types';

export abstract class BaseSystemNode {
    constructor(
        public readonly id: number,
        public readonly type: SystemComponentType,
        public x: number,
        public y: number,
        public readonly width = 160,
        public readonly height = 72,
    ) { }

    get center(): NodePoint {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        };
    }

    get label(): string {
        return this.type;
    }

    moveTo({ x, y }: NodePoint): void {
        this.x = x;
        this.y = y;
    }

    getAnchorToward(target: BaseSystemNode): NodePoint {
        const current = this.center;
        const other = target.center;
        const dx = other.x - current.x;
        const dy = other.y - current.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            return {
                x: dx >= 0 ? this.x + this.width : this.x,
                y: current.y,
            };
        }

        return {
            x: current.x,
            y: dy >= 0 ? this.y + this.height : this.y,
        };
    }
}
