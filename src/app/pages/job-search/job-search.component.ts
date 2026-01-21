import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { ApplicationTrackerComponent } from './components/application-tracker';
import { ResumeBuilderComponent } from './components/resume-builder';

@Component({
    templateUrl: './job-search.component.html',
    styleUrl: './job-search.component.scss',
    imports: [
        ApplicationTrackerComponent,
        MatTab,
        MatTabGroup,
        ResumeBuilderComponent,
    ],
})
export class JobSearchComponent {
    activeTab = 'Overview';
}
