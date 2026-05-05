import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { withFormlyFieldSelect } from '@ngx-formly/material/select';
import { withFormlyFieldTextArea } from '@ngx-formly/material/textarea';
import { FormlyFieldToggle } from '@ngx-formly/material/toggle';

import {
    ColorPickerComponent,
    RepeatSectionComponent,
} from '@core/form-fields';
import { errorInterceptorFn } from '@core/interceptors';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([authHttpInterceptorFn, errorInterceptorFn]),
        ),
        provideAuth0(environment.auth0),
        provideFormlyCore([
            withFormlyFormField(),
            withFormlyFieldInput(),
            withFormlyFieldTextArea(),
            withFormlyFieldSelect(),
            {
                types: [
                    {
                        name: 'repeat-section',
                        component: RepeatSectionComponent,
                    },
                    {
                        name: 'toggle',
                        component: FormlyFieldToggle,
                    },
                    {
                        name: 'color-picker',
                        component: ColorPickerComponent,
                    },
                ],
            },
        ]),
    ],
};
