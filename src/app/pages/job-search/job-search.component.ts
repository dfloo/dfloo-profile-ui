import { Component, inject, signal } from '@angular/core';
import {
    ActivatedRoute,
    RouterLink,
    RouterOutlet
} from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
    templateUrl: './job-search.component.html',
    styleUrl: './job-search.component.scss',
    imports: [
        MatTabLink,
        MatTabNav,
        MatTabNavPanel,
        RouterOutlet,
        RouterLink
    ],
})
export class JobSearchComponent {
    childRoutes = [
        { path: 'resume-builder', label: 'Resume Builder' },
        { path: 'application-tracker', label: 'Application Tracker' },
    ];
    activePath = signal(this.childRoutes[0].path);

    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        const child = this.route.snapshot.firstChild;
        const path = child?.routeConfig?.path || 'resume-builder';

        this.activePath.set(path);
    }
}
