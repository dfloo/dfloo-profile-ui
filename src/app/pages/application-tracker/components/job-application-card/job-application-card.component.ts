import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { JobApplication } from '@models/job-application';

@Component({
    selector: 'job-application-card',
    templateUrl: './job-application-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatExpansionModule, MatButtonModule]
})
export class JobApplicationCardComponent {
    jobApplication = model<JobApplication>();

    get displayName(): string {
        const { company, role } = this.jobApplication() ?? {};

        return `${company} - ${role}`;
    }
}