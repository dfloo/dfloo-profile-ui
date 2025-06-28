import { Routes } from '@angular/router';

import { ResumeBuilderComponent } from '@pages/resume-builder';
import { WelcomeComponent } from '@pages/welcome';

export const routes: Routes = [
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'resume-builder',
        component: ResumeBuilderComponent
    },
    {
        path: '**',
        redirectTo: 'welcome'
    }
];
