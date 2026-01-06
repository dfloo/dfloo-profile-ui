import { BaseModel } from '../base.model';

export class JobApplication extends BaseModel {
    status: JobApplicationStatus = JobApplicationStatus.Unsubmitted;
    sortIndex = 0;
    company?: string;
    role?: string;
    description?: string;
    notes?: string;
    resumeId?: string;

    constructor(props: Partial<JobApplication>) {
        super(props);
        Object.assign(this, {
            ...props,
            created: this.created,
            updated: this.updated,
        });
    }

    static normalize(record: JobApplicationDTO): JobApplication {
        return new JobApplication({
            id: record.jobApplicationId,
            sortIndex: record.sortIndex,
            company: record.company,
            role: record.role,
            description: record.description,
            status: record.status,
            notes: record.notes,
            resumeId: record.resumeId,
            created: record.created,
            updated: record.updated,
        });
    }

    static serialize(app: JobApplication): JobApplicationDTO {
        return {
            jobApplicationId: app.id,
            sortIndex: app.sortIndex,
            company: app.company,
            role: app.role,
            description: app.description,
            status: app.status,
            notes: app.notes,
            resumeId: app.resumeId,
        };
    }
}

export interface JobApplicationDTO {
    jobApplicationId?: string;
    sortIndex?: number;
    company?: string;
    role?: string;
    description?: string;
    status?: JobApplicationStatus;
    notes?: string;
    resumeId?: string;
    created?: string;
    updated?: string;
}

export enum JobApplicationStatus {
    Unsubmitted = 'Unsubmitted',
    Submitted = 'Submitted',
    Interviewing = 'Interviewing',
    OfferPending = 'Offer Pending',
    OfferAccepted = 'Offer Accepted',
    OfferDeclined = 'Offer Declined',
    Rejected = 'Rejected',
}

export const ActiveStatuses = [
    JobApplicationStatus.Unsubmitted,
    JobApplicationStatus.Submitted,
    JobApplicationStatus.Interviewing,
    JobApplicationStatus.OfferPending,
];
