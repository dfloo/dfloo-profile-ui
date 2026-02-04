import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
    templateUrl: './job-search.component.html',
    styleUrl: './job-search.component.scss',
    imports: [
        MatTabLink,
        MatTabNav,
        MatTabNavPanel,
        RouterOutlet,
        RouterLinkWithHref
    ],
})
export class JobSearchComponent {
    childRoutes = [
        { path: 'resume-builder', label: 'Resume Builder' },
        { path: 'application-tracker', label: 'Application Tracker' },
    ];
    activeRoute = this.childRoutes[0];
}
