export type SystemComponentType = 'Client' | 'Server' | 'Database';

export interface NodePoint {
    x: number;
    y: number;
}

export interface SystemNodeEdge {
    id: string;
    sourceId: number;
    targetId: number;
}
