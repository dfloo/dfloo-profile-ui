import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { ResumeService } from '@api/resume';
import { Resume } from '@models/resume';

@Component({
    templateUrl: './resume-builder.component.html',
    styleUrl: './resume-builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeBuilderComponent implements OnInit {

    private resumeService = inject(ResumeService);

    resumes?: Resume[];

    ngOnInit() {
        this.resumeService.getResumes().subscribe(resumes => {
            this.resumes = resumes;
        });
    }
}
