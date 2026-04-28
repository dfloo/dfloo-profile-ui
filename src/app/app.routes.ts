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
            {
                path: 'system-design',
                loadComponent: () => import('@pages/job-search')
                    .then((m) => m.SystemDesignComponent),
            },
        ]
    },
    {
        path: 'bandits-corner',
        title: "Bandit's Corner",
        loadComponent: () =>
            import('@pages/bandits-corner').then((m) => m.BanditsCornerComponent),
    },
];

export const routes: Routes = [
    ...sidenavRoutes,
    {
        path: '**',
        redirectTo: 'welcome',
    },
];
