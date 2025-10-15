import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { cloneDeep } from 'lodash';

import { ProfileService } from '@api/profile';
import { ResumeService } from '@api/resume';
import { Resume } from '@models/resume';

import { ResumeEditorComponent, ResumesTableComponent } from './components';

@Component({
    templateUrl: './resume-builder.component.html',
    styleUrl: './resume-builder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResumesTableComponent, ResumeEditorComponent]
})
export class ResumeBuilderComponent implements OnInit {
    private resumeService = inject(ResumeService);
    private profileService = inject(ProfileService);
    
    resumes = signal<Resume[]>([]);
    resume = signal<Resume | undefined>(undefined);
    userProfile = toSignal(this.profileService.getUserProfile());

    ngOnInit(): void {
        this.resumeService.getResumes().subscribe(resumes => {
            this.resumes.set(resumes);
        });
    }

    deleteResumes(resumeIDs: string[]): void {
        this.resumeService.deleteResumes(resumeIDs)
            .subscribe(() => {
                this.resumes.set(this.resumes().filter(resume => {
                    return resume.id && !resumeIDs.includes(resume.id);
                }))
            });
    }

    saveResume(resume: Resume): void {
        if (!resume) {
            return;
        }
        if (resume.isNew) {
            this.resumeService.createResume(resume).subscribe(created => {
                this.resume.set(created);
                this.resumes.set([...this.resumes(), created])
            });
        } else {
            this.resumeService.updateResume(resume).subscribe(updated => {
                this.resume.set(updated);
                this.resumes.set(this.resumes().map(
                    resume => (resume.id === updated.id ? updated : resume)
                ));
            });
        }
    }

    editResume(resume: Resume): void {
        this.resume.set(resume);
    }

    copyResume(resume: Resume): void {
        const copy = cloneDeep(resume);
        copy.id = undefined;
        copy.isNew = true;
        const date = new Date().toLocaleString();
        copy.created = date;
        copy.updated = date;

        this.saveResume(copy);
    }

    newResume(): void {
        this.resume.set(new Resume({
            profile: this.userProfile(),
            experience: [{}],
            education: [{}]
        }));
    }

    downloadResume(resume: Resume): void {
        this.resumeService.downloadResume(resume)
            .subscribe(pdf => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(pdf);
                downloadLink.download = `${resume.fileName}.pdf`;
                downloadLink.click();
            });
    }

    viewResume(resume: Resume): void {
        this.resumeService.downloadResume(resume)
            .subscribe(pdf => window.open(URL.createObjectURL(pdf)));
    }
}
