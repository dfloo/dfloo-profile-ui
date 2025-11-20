import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

import { JobApplication } from '@models/job-application';

@Component({
    selector: 'job-application-card',
    templateUrl: './job-application-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardContent]
})
export class JobApplicationCardComponent {
    jobApplication = model<JobApplication>();

    get displayName(): string {
        const { company, role } = this.jobApplication() ?? {};

        return `${company} - ${role}`;
    }
}