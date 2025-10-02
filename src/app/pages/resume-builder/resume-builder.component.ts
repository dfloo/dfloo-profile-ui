import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProfileService } from '@api/profile';
import { ResumeService } from '@api/resume';
import { Resume } from '@models/resume';

import { ResumesTableComponent } from './components';

@Component({
    templateUrl: './resume-builder.component.html',
    styleUrl: './resume-builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResumesTableComponent]
})
export class ResumeBuilderComponent implements OnInit {
    private resumeService = inject(ResumeService);
    private profileService = inject(ProfileService);
    
    resumes = signal<Resume[]>([]);
    resume = signal<Resume | undefined>(undefined);
    userProfile = toSignal(this.profileService.getUserProfile())

    ngOnInit(): void {
        this.resumeService.getResumes().subscribe(resumes => {
            this.resumes.set(resumes);
        });
    }

    deleteResumes(resumeIDs: string[]): void {
        this.resumeService.deleteResumes(resumeIDs)
            .subscribe(() => {
                this.resumes.set(this.resumes().filter(resume => {
                    return resume.id && resumeIDs.includes(resume.id)
                }))
            });
    }
}
