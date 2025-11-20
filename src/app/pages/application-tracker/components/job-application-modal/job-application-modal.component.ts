import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';

import { JobApplication } from '@models/job-application';
import { Resume } from '@models/resume';

import { JobApplicationFormFieldsService } from '../../services';

@Component({
    templateUrl: './job-application-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [JobApplicationFormFieldsService],
    imports: [
        FormlyForm,
        ReactiveFormsModule,
        MatButton,
        MatDialogContent,
        MatDialogActions
    ]
})
export class JobApplicationModalComponent implements OnInit {
    private data = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<JobApplicationModalComponent>);
    private formFieldsService = inject(JobApplicationFormFieldsService);

    jobApplication = signal(new JobApplication({ sortIndex: 0 }));
    appSnapShot?: JobApplication;
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [];

    get submitLabel(): string {
        return `${this.data.isNew ? 'Create' : 'Update'} Job Application`;
    }

    get hasChanged(): boolean {
        return !isEqual(this.jobApplication(), this.appSnapShot);
    }

    constructor() {
        effect(() => {
            this.appSnapShot = cloneDeep(this.jobApplication());
        });
    }

    ngOnInit(): void {
        this.fields = this.formFieldsService.getFields(this.data);

        if (this.data.jobApplication) {
            this.jobApplication.set(this.data.jobApplication);
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    submit(): void {
        this.dialogRef.close(this.jobApplication());
    }
}

export interface JobApplicationModalData {
    isNew: boolean;
    resumes: Resume[];
    jobApplication?: JobApplication
}
