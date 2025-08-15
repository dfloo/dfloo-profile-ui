import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    OnInit,
    output
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MatButtonModule } from '@angular/material/button';

import { Profile } from '@models/profile';

import { ProfileFormFieldsService } from './services';

@Component({
    imports: [
        MatInputModule,
        FormlyForm,
        ReactiveFormsModule,
        MatButtonModule
    ],
    providers: [ProfileFormFieldsService],
    selector: 'profile-form',
    templateUrl: './profile-form.component.html',
    styleUrl: './profile-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent implements OnInit {
    submitProfile = output<Profile>();
    profile = input<Profile>(new Profile({}));
    model = new Profile({});
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [];

    private formFieldsService = inject(ProfileFormFieldsService);

    constructor() {
        effect(() => (this.model = this.profile()))
    }

    ngOnInit(): void {
        this.fields = this.formFieldsService.getFields();
    }
}
