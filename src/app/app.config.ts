import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

import { RepeatSectionComponent } from '@core/form-fields';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authHttpInterceptorFn])),
        provideAuth0(environment.auth0),
        provideFormlyCore([
            ...withFormlyMaterial(),
            {
                types: [{
                    name: 'repeat-section', component: RepeatSectionComponent
                }]
            }
        ])
    ]
};
