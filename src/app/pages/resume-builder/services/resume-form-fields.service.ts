import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class ResumeFormFieldsService {
    getSettingsFields(): FormlyFieldConfig[] {
        return [{
            fieldGroupClassName: 'd-flex',
            fieldGroup: [{
                key: 'fileName',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'File Name' },
                defaultValue: 'My Resume'
            }, {
                key: 'description',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Description' },
                defaultValue: 'Resume description'
            }, {
                key: 'templateSettings',
                fieldGroupClassName: 'd-flex',
                fieldGroup: [{
                    key: 'templateName',
                    type: 'select',
                    className: 'flex-grow',
                    props: {
                        label: 'Template',
                        options: [{ value: 'default', label: 'Default' }]
                    },
                    defaultValue: 'default'
                }, {
                    key: 'fontFamily',
                    type: 'select',
                    className: 'flex-grow',
                    props: {
                        label: 'Font Family',
                        options: [{ value: 'default', label: 'Default' }]
                    },
                    defaultValue: 'default'
                }]
            }]
        }];
    }

    getSummaryFields(): FormlyFieldConfig[] {
        return [{
            key: 'summary',
            type: 'textarea',
            props: { rows: 5 }
        }];
    }

    getSkillsFields(): FormlyFieldConfig[] {
        return [{
            key: 'skills',
            type: 'repeat-section',
            className: 'flex-grow',
            props: {
                addText: 'Add Skill',
                removeText: 'Remove Skill'
            },
            fieldArray: { type: 'input' }
        }];
    }

    getExperienceFields(): FormlyFieldConfig[] {
        return [{
            key: 'experience',
            type: 'repeat-section',
            className: 'flex-grow',
            props: {
                addText: 'Add Experience',
                removeText: 'Remove Experience',
                expand: 'each',
                subsectionLabel: 'Employer',
                subsectionKey: 'employer'
            },
            fieldArray: {
                fieldGroup: [{
                    fieldGroupClassName: 'd-flex',
                    fieldGroup: [{
                        key: 'title',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Title' }
                    }, {
                        key: 'employer',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Employer' }
                    },
                    {
                        key: 'location',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Location' }
                    },
                    {
                        key: 'startDate',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Start Date' }
                    },
                    {
                        key: 'endDate',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'End Date' }
                    }]
                }, {
                    key: 'description',
                    type: 'textarea',
                    props: {
                        label: 'Description'
                    }
                }, {
                    key: 'bulletPoints',
                    type: 'repeat-section',
                    props: {
                        label: 'Bullet Points',
                        addText: 'Add Bullet Point',
                        removeText: 'Remove Bullet Point',
                        expand: 'all'
                    },
                    fieldArray: { type: 'input' }
                }]
            }
        }];
    }

    getEducationFields(): FormlyFieldConfig[] {
        return [{
            key: 'education',
            type: 'repeat-section',
            className: 'flex-grow',
            props: {
                addText: 'Add Education',
                removeText: 'Remove Education',
                expand: 'each'
            },
            fieldArray: {
                fieldGroup:[{
                    fieldGroupClassName: 'd-flex',
                    fieldGroup: [{
                        key: 'name',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Name' }
                    }, {
                        key: 'location',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Location' }
                    }]
                }, {
                    fieldGroupClassName: 'd-flex',
                    fieldGroup: [{
                        key: 'type',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Type' }
                    }, {
                        key: 'completionDate',
                        type: 'input',
                        className: 'flex-grow',
                        props: { label: 'Completion Date' }
                    }]
                }]
            }
        }];
    }
}
