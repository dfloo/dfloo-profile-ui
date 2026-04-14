import { BaseSystemNode } from './base-system-node';

export class ServerSystemNode extends BaseSystemNode {
    override get label(): string {
        return 'Server';
    }
}
