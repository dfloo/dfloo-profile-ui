import { Profile, ProfileDTO } from '@models/profile';

import { BaseModel } from '../base.model';

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
            updated: this.updated,
            sections: props.sections ?? defaultSections
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
        return {
            resumeId,
            updated: '8/27/2025',
            fileName: `Mock_Resume_${resumeId}`,
            templateSettings: {
                templateName: 'default',
                fontFamily: 'helvet'
            },
            profile: Profile.getMockDTO('1'),
            description: 'Angular Focused',
            summary: 'Senior Software Engineer with 6+ years of experience in developing enterprise-grade solutions within the wealth management sector.',
            skills: [
                'Angular, React',
                'Java, Ruby, Go',
                'Jenkins, CI/CD',
                'Code Review',
                'UI/UX Design',
                'Product/Technical Requirements'
            ],
            experience: [
                {
                    employer: 'MyVest',
                    location: 'San Francisco, CA',
                    startDate: '01/2019',
                    endDate: '07/2025',
                    title: 'Senior Software Engineer',
                    description: 'Fintech company delivering portfolio management at scale',
                    bulletPoints: ['First', 'Second', 'Third']
                }
            ],
            education: [
                {
                    name: 'Villanova University',
                    location: 'Villanova, PA',
                    type: 'B.S. Chemical Engineering',
                    completionDate: '05/2010'
                },
                {
                    name: 'App Academy',
                    location: 'San Francisco, CA',
                    type: 'Software Engineering Program',
                    completionDate: '11/2018'
                }
            ]
        }
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
    Experience = 'Experience',
    Education = 'Education',
    Skills = 'Skills',
    Summary = 'Summary'
}

const defaultSections = [
    SectionType.Summary,
    SectionType.Skills,
    SectionType.Experience,
    SectionType.Education
];

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
    fontFamily: 'helvet' | 'times'
}
