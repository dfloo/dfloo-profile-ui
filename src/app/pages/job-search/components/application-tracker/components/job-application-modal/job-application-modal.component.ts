import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';

import { JobApplication } from '@models/job-application';
import { Resume } from '@models/resume';

import { JobApplicationFormFieldsService } from '../../services';
import { JobApplicationService } from '@api/job-application';

@Component({
    templateUrl: './job-application-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [JobApplicationFormFieldsService],
    imports: [
        FormlyForm,
        ReactiveFormsModule,
        MatButton,
        MatDialogContent,
        MatDialogActions,
        MatTabGroup,
        MatTab,
    ],
})
export class JobApplicationModalComponent implements OnInit {
    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<JobApplicationModalComponent>);
    private formFieldsService = inject(JobApplicationFormFieldsService);
    private jobApplicationService = inject(JobApplicationService);

    isAuthenticated = false;
    isNew = false;
    jobApplication = signal(new JobApplication({ sortIndex: 0 }));
    urlModel: { url?: string } = {};
    appSnapShot?: JobApplication;
    form = new FormGroup({});
    editFields: FormlyFieldConfig[] = [];
    urlFields: FormlyFieldConfig[] = [];
    manualFields: FormlyFieldConfig[] = [];
    createMode: CreateMode = CreateMode.ManualEntry

    get submitLabel(): string {
        return `${this.isNew ? 'Create' : 'Update'} Job Application`;
    }

    get showSubmit(): boolean {
        if (this.createMode === CreateMode.FromURL) {
            return !!this.urlModel.url;
        }

        return !isEqual(this.jobApplication(), this.appSnapShot);
    }

    constructor() {
        effect(() => {
            this.appSnapShot = cloneDeep(this.jobApplication());
        });
    }

    ngOnInit(): void {
        this.urlFields = this.formFieldsService.getUrlFields(this.data)
        this.manualFields = this.formFieldsService.getManualFields(this.data)
        this.editFields = this.formFieldsService.getEditFields(this.data);
        this.isAuthenticated = this.data.isAuthenticated;
        this.isNew = this.data.isNew

        if (this.isNew && this.isAuthenticated) {
            this.createMode = CreateMode.FromURL;
        }

        if (this.data.jobApplication) {
            this.jobApplication.set(this.data.jobApplication);
        }
    }

    onTabChange({ index }: MatTabChangeEvent): void {
        this.createMode = index;
    }

    close(): void {
        this.dialogRef.close();
    }

    submit(): void {
        if (this.createMode === CreateMode.FromURL) {
            this.jobApplicationService.createFromURL(this.urlModel.url ?? '')
                .subscribe({
                    next: () => this.close(),
                    error: (e) => {
                        console.log('error', e)
                    }
                });
        } else {
            this.dialogRef.close(this.jobApplication());
        }
    }
}

export interface JobApplicationModalData {
    isNew: boolean;
    isAuthenticated: boolean;
    resumes: Resume[];
    jobApplication?: JobApplication;
}

enum CreateMode {
    FromURL,
    ManualEntry
}
