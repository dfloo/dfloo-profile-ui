import { Routes } from '@angular/router';

import { ResumeBuilderComponent } from '@pages/resume-builder';
import { WelcomeComponent } from '@pages/welcome';

export const sidenavRoutes = [
    {
        path: 'welcome',
        title: 'Welcome',
        component: WelcomeComponent
    },
    {
        path: 'resume-builder',
        title: 'Resume Builder',
        component: ResumeBuilderComponent
    }
]
export const routes: Routes = [
    ...sidenavRoutes,
    {
        path: '**',
        redirectTo: 'welcome'
    }
];
