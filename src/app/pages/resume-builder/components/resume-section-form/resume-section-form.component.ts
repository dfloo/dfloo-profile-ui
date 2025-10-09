import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

import { Resume } from '@models/resume';

@Component({
    imports: [
        MatInputModule,
        FormlyForm,
        ReactiveFormsModule,
        MatButtonModule
    ],
    selector: 'resume-section-form',
    templateUrl: './resume-section-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeSectionFormComponent {
    resume = model<Resume>();
    fields = input<FormlyFieldConfig[]>([]);
    form = new FormGroup({});
}