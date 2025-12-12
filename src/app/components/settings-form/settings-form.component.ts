import {
    ChangeDetectionStrategy,
    Component,
    model,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

import { defaultSettings, Settings } from '@api/settings';
import { materialThemeOptions } from '@core/models';


@Component({
    selector: 'settings-form',
    templateUrl: './settings-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormlyForm, ReactiveFormsModule]
})
export class SettingsFormComponent {
    settings = model<Settings>(defaultSettings);
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [{
        key: 'materialTheme',
        type: 'select',
        props: {
            label: 'Material Theme',
            options: materialThemeOptions
        }
    }];
}
