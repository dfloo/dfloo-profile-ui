import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

import { Resume } from '@models/resume';

@Component({
    selector: 'resume-section-form',
    templateUrl: './resume-section-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormlyForm, ReactiveFormsModule]
})
export class ResumeSectionFormComponent {
    resume = model<Resume>();
    fields = input<FormlyFieldConfig[]>([]);
    form = new FormGroup({});
}