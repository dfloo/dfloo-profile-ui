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
