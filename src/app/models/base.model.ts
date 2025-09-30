export class BaseModel {
    id?: string;
    isNew: boolean;
    created?: Date | string;
    updated?: Date | string;

    constructor({ id, created, updated }: Partial<BaseModel>) {
        this.id = id;
        this.isNew = !id;
        this.created = created ? new Date(created) : undefined;
        this.updated = updated ? new Date(updated) : undefined;
    }
}
