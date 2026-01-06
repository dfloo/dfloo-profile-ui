import {
    ChangeDetectionStrategy,
    Component,
    model,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

import {
    defaultSettings,
    FontFamily,
    fontFamilyOptions,
    Settings
} from '@api/settings';
import {
    materialColorOptions,
    MaterialTheme,
    materialThemeOptions
} from '@core/models';

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
    }, {
        key: 'customThemeConfig',
        expressions: {
            hide: ({ form }) =>
                form?.value.materialTheme !== MaterialTheme.Custom
        },
        fieldGroup: [{
            key: 'fontFamily',
            type: 'select',
            props: {
                label: 'Font',
                options: fontFamilyOptions
            },
            defaultValue: FontFamily.Roboto
        }, {
            key: 'primary',
            type: 'select',
            props: {
                label: 'Primary Color',
                options: materialColorOptions
            },
            defaultValue: '#3F51B5'
        }, {
            key: 'accent',
            type: 'select',
            props: {
                label: 'Accent Color',
                options: materialColorOptions
            },
            defaultValue: '#FFEB3B'
        }, {
            key: 'dark',
            type: 'toggle',
            props: {
                label: 'Dark Mode'
            }
        }]
    }];
}
