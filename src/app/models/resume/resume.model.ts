import { BaseModel } from '../base.model';

export class Resume extends BaseModel {
    name?: string;

    constructor(props: Partial<Resume>) {
        super(props);
        Object.assign(this, props);
    }

    static normalize(record: ResumeDTO): Resume {
        return new Resume({
            id: record.resumeId,
            name: record.name
        });
    }

    static serialize(resume: Resume): ResumeDTO {
        return {
            resumeId: resume.id,
            name: resume.name
        };
    }

    static getMockDTO(isNew = false): ResumeDTO {
        return {
            resumeId: isNew ? undefined : '1',
            name: 'Devin Flood'
        }
    }
}

export interface ResumeDTO {
    resumeId?: string;
    name?: string;
}
