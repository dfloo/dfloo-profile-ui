import { BaseSystemNode } from './base-system-node';
import { ClientSystemNode } from './client-system-node';
import { DatabaseSystemNode } from './database-system-node';
import { ServerSystemNode } from './server-system-node';
import { SystemComponentType } from './system-node.types';

type NodeFactoryFn = (id: number, x: number, y: number) => BaseSystemNode;

const nodeFactoryMap: Record<SystemComponentType, NodeFactoryFn> = {
    Client: (id, x, y) => new ClientSystemNode(id, 'Client', x, y),
    Server: (id, x, y) => new ServerSystemNode(id, 'Server', x, y),
    Database: (id, x, y) => new DatabaseSystemNode(id, 'Database', x, y),
};

export function createSystemNode(
    type: SystemComponentType,
    id: number,
    x: number,
    y: number,
): BaseSystemNode {
    return nodeFactoryMap[type](id, x, y);
}
