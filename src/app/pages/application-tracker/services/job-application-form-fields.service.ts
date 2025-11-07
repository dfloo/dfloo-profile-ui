import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SelectOption } from '@core/form-fields';
import { JobApplicationStatus } from '@models/job-application';
import { Resume } from '@models/resume';

import { JobApplicationModalData } from '../components';

@Injectable()
export class JobApplicationFormFieldsService {
    getFields(
        { isNew, resumes }: JobApplicationModalData
    ): FormlyFieldConfig[] {
        return [{
            fieldGroupClassName: 'd-flex',
            fieldGroup: [
                    {
                    key: 'company',
                    type: 'input',
                    className: 'flex-grow',
                    props: { label: 'Company' }
                }, {
                    key: 'role',
                    type: 'input',
                    className: 'flex-grow',
                    props: { label: 'Role' }
                }, {
                    key: 'resumeId',
                    type: 'select',
                    className: 'flex-grow',
                    props: {
                        label: 'Resume',
                        options: this.getResumeOptions(resumes)
                    }
                }, ...(isNew ? [] : [{
                    key: 'status',
                    type: 'select',
                    className: 'flex-grow',
                    props: {
                        label: 'Status',
                        options: this.getStatusOptions()
                    }
                }])
            ]
        }, {
            key: 'description',
            type: 'textarea',
            props: {
                label: 'Description',
                autosize: true,
                autosizeMaxRows: 8
            }
        }, {
            key: 'notes',
            type: 'textarea',
            props: {
                label: 'Notes',
                autosize: true,
                autosizeMaxRows: 8
            }
        }];
    }

    private getResumeOptions(resumes: Resume[]): SelectOption[] {
        return [
            { label: 'Clear Selection' },
            ...resumes.reduce((options, { description, id }) => {
                if (description && id) {
                    options.push({ label: description, value: id });
                }

                return options;
            }, [] as SelectOption[])
        ];
    }

    private getStatusOptions(): SelectOption[] {
        return Object.values(JobApplicationStatus)
            .map(status => ({ value: status, label: status}));
    }
}