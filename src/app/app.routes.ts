import { Routes } from '@angular/router';

export const sidenavRoutes = [
    {
        path: 'welcome',
        title: 'Welcome',
        loadComponent: () =>
            import('@pages/welcome').then((m) => m.WelcomeComponent),
    },
    {
        path: 'job-search',
        title: 'Job Search Tools',
        loadComponent: () =>
            import('@pages/job-search').then((m) => m.JobSearchComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('@pages/job-search')
                    .then((m) => m.ResumeBuilderComponent),
            },
            {
                path: 'resume-builder',
                loadComponent: () => import('@pages/job-search')
                    .then((m) => m.ResumeBuilderComponent),
            },
            {
                path: 'application-tracker',
                loadComponent: () => import('@pages/job-search')
                    .then((m) => m.ApplicationTrackerComponent),
            },
        ]
    },
    {
        path: 'bandits-story',
        title: "Bandit's Story",
        loadComponent: () =>
            import('@pages/bandits-story').then((m) => m.BanditsStoryComponent),
    },
];

export const routes: Routes = [
    ...sidenavRoutes,
    {
        path: '**',
        redirectTo: 'welcome',
    },
];
