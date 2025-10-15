import { Profile, ProfileDTO } from '@models/profile';

import { BaseModel } from '../base.model';
import { getMockResumeDTO } from './resume.mock-data';

export class Resume extends BaseModel {
    fileName?: string;
    profile?: Profile;
    sections!: SectionType[];
    summary?: string;
    skills?: string[];
    education?: Education[];
    experience?: Experience[];
    description?: string;
    templateSettings?: TemplateSettings;

    constructor(props: Partial<Resume>) {
        super(props);
        Object.assign(this, {
            ...props,
            created: this.created,
            updated: this.updated
        });
    }

    static normalize(record: ResumeDTO): Resume {
        return new Resume({
            id: record.resumeId,
            profile: record.profile ?
                Profile.normalize(record.profile)
                : undefined,
            sections: record.sections,
            summary: record.summary,
            skills: record.skills,
            experience: record.experience,
            education: record.education,
            fileName: record.fileName,
            templateSettings: record.templateSettings,
            description: record.description,
            created: record.created,
            updated: record.updated
        });
    }

    static serialize(resume: Resume): ResumeDTO {
        return {
            resumeId: resume.id,
            profile: resume.profile
                ? Profile.serialize(resume.profile)
                : undefined,
            sections: resume.sections,
            summary: resume.summary,
            skills: resume.skills,
            experience: resume.experience,
            education: resume.education,
            fileName: resume.fileName,
            templateSettings: resume.templateSettings,
            description: resume.description
        };
    }

    static getMockDTO(resumeId?: string): ResumeDTO {
        return getMockResumeDTO(resumeId);
    }
}

export interface ResumeDTO {
    resumeId?: string;
    fileName?: string;
    templateSettings?: TemplateSettings;
    profile?: ProfileDTO;
    skills?: string[];
    sections?: SectionType[];
    experience?: Experience[];
    education?: Education[];
    summary?: string;
    description?: string;
    updated?: string;
    created?: string;
}

export enum SectionType {
    Summary = 'Summary',
    Skills = 'Skills',
    Experience = 'Experience',
    Education = 'Education'
}

export const defaultSections: SectionType[] = (
    () => Object.keys(SectionType) as SectionType[]
)();

export interface Section {
    type?: SectionType,
    value?: Experience[] | Education [] | string[] | string
};

interface Experience {
    employer?: string;
    location?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    bulletPoints?: string[];
};

interface Education {
    name?: string;
    location?: string;
    type?: string;
    completionDate?: string;
}

interface TemplateSettings {
    templateName: 'default';
    fontFamily: 'default'
}
