import { Routes } from '@angular/router';

import { ApplicationTrackerComponent } from '@pages/application-tracker';
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
    },
    {
        path: 'application-tracker',
        title: 'Application Tracker',
        component: ApplicationTrackerComponent
    }
];

export const routes: Routes = [
    ...sidenavRoutes,
    {
        path: '**',
        redirectTo: 'welcome'
    }
];
