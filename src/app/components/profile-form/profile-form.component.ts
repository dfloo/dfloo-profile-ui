import {
    ChangeDetectionStrategy,
    Component,
    inject,
    model,
    OnInit
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MatButtonModule } from '@angular/material/button';

import { Profile } from '@models/profile';

import { ProfileFormFieldsService } from './services';

@Component({
    selector: 'profile-form',
    templateUrl: './profile-form.component.html',
    styleUrl: './profile-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProfileFormFieldsService],
    imports: [MatInputModule, FormlyForm, ReactiveFormsModule, MatButtonModule]
})
export class ProfileFormComponent implements OnInit {
    profile = model<Profile>();
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [];

    private formFieldsService = inject(ProfileFormFieldsService);

    ngOnInit(): void {
        this.fields = this.formFieldsService.getFields();
    }
}
