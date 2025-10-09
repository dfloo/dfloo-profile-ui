export class BaseModel {
    id?: string;
    isNew: boolean;
    created: string;
    updated: string;

    constructor({ id, created, updated }: Partial<BaseModel>) {
        this.id = id;
        this.isNew = !id;
        this.created = created ? new Date(created).toLocaleString() : '';
        this.updated = updated ? new Date(updated).toLocaleString() : '';
    }
}
