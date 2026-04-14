import { BaseSystemNode } from './base-system-node';

export class ClientSystemNode extends BaseSystemNode {
    override get label(): string {
        return 'Client';
    }
}
