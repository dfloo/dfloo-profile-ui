import { BaseSystemNode } from './base-system-node';

export class DatabaseSystemNode extends BaseSystemNode {
    override get label(): string {
        return 'Database';
    }
}
