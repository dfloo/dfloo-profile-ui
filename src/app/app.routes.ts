import { Routes } from '@angular/router';

export const sidenavRoutes = [
    {
        path: 'welcome',
        title: 'Welcome',
        loadComponent: () => import('@pages/welcome')
            .then(m => m.WelcomeComponent)
    },
    {
        path: 'resume-builder',
        title: 'Resume Builder',
        loadComponent: () => import('@pages/resume-builder')
            .then(m => m.ResumeBuilderComponent)
    },
    {
        path: 'application-tracker',
        title: 'Application Tracker',
        loadComponent: () => import('@pages/application-tracker')
            .then(m => m.ApplicationTrackerComponent)
    },
    {
        path: 'bandits-story',
        title: "Bandit's Story",
        loadComponent: () => import('@pages/bandits-story')
            .then(m => m.BanditsStoryComponent)
    }
];

export const routes: Routes = [
    ...sidenavRoutes,
    {
        path: '**',
        redirectTo: 'welcome'
    }
];
