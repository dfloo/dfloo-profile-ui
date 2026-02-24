import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SelectOption } from '@core/form-fields';
import { JobApplicationStatus } from '@models/job-application';
import { Resume } from '@models/resume';

import { JobApplicationModalData } from '../components';

@Injectable()
export class JobApplicationFormFieldsService {
    getEditFields(data: JobApplicationModalData): FormlyFieldConfig[] {
        const {
            company,
            role,
            resumeId,
            status,
            description,
            notes,
        } = this.getBaseFields(data);

        return [
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [
                    company,
                    role,
                    resumeId,
                    status,
                ],
            },
            description,
            notes,
        ];
    }

    getManualFields(data: JobApplicationModalData): FormlyFieldConfig[] {
        const {
            company,
            role,
            resumeId,
            description,
            notes,
        } = this.getBaseFields(data);

        return [
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [
                    company,
                    role,
                    resumeId,
                ],
            },
            description,
            notes,
        ];
    }

    getUrlFields(data: JobApplicationModalData): FormlyFieldConfig[] {
        const { url } = this.getBaseFields(data);

        return [url];
    }

    private getBaseFields({
        isAuthenticated,
        resumes,
    }: JobApplicationModalData): Record<string, FormlyFieldConfig> {
        return {
            url: {
                key: 'url',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Job Posting URL' },
                expressions: { hide: () => !isAuthenticated }
            },
            company: {
                key: 'company',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Company' },
            },
            role: {
                key: 'role',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Role' },
            },
            resumeId: {
                key: 'resumeId',
                type: 'select',
                className: 'flex-grow',
                props: {
                    label: 'Resume',
                    options: this.getResumeOptions(resumes),
                },
            },
            status: {
                key: 'status',
                type: 'select',
                className: 'flex-grow',
                props: {
                    label: 'Status',
                    options: this.getStatusOptions(),
                },
            },
            description: {
                key: 'description',
                type: 'textarea',
                props: {
                    label: 'Description',
                    autosize: true,
                    autosizeMaxRows: 8,
                },
            },
            notes: {
                key: 'notes',
                type: 'textarea',
                props: {
                    label: 'Notes',
                    autosize: true,
                    autosizeMaxRows: 8,
                },
            },
        }
    }

    private getResumeOptions(resumes: Resume[]): SelectOption[] {
        return [
            { label: 'Clear Selection' },
            ...resumes.reduce((options, { description, id }) => {
                if (description && id) {
                    options.push({ label: description, value: id });
                }

                return options;
            }, [] as SelectOption[]),
        ];
    }

    private getStatusOptions(): SelectOption[] {
        return Object.values(JobApplicationStatus).map((status) => ({
            value: status,
            label: status,
        }));
    }
}
