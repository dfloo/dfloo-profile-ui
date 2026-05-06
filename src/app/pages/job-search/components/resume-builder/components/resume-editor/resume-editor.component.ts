import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
    Component,
    DestroyRef,
    effect,
    inject,
    input,
    model,
    OnInit,
    output,
    QueryList,
    signal,
    ViewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, EMPTY, map, Subject, switchMap, take, tap } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';

import { ProfileFormComponent } from '@components/profile-form';
import {
    MessageDialogComponent,
    MessageDialogResult,
} from '@components/message-dialog';
import { defaultSections, Resume, Section, SectionType } from '@models/resume';

import { ResumeService } from '@api/resume';
import { UserService } from '@core/services';
import { ResumeFormFieldsService } from '../../services';
import { ResumeSectionFormComponent } from '../resume-section-form';

@Component({
    selector: 'resume-editor',
    templateUrl: './resume-editor.component.html',
    styleUrl: './resume-editor.component.scss',
    providers: [ResumeFormFieldsService],
    imports: [
        CdkDrag,
        CdkDropList,
        CdkDragHandle,
        MatAccordion,
        MatButton,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatProgressSpinner,
        MatTooltip,
        ProfileFormComponent,
        ResumeSectionFormComponent,
    ],
})
export class ResumeEditorComponent implements OnInit {
    private formFieldsService = inject(ResumeFormFieldsService);
    private dialog = inject(MatDialog);
    private sanitizer = inject(DomSanitizer);
    private resumeService = inject(ResumeService);
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    isDownloadingResume = input<boolean>(false);
    savedResume = input<Resume | undefined>();
    saveResume = output<Resume>();
    viewResume = output<Resume>();
    downloadResume = output<Resume>();
    deleteResume = output<string[]>();
    tailorResume = output<Resume>();
    back = output();
    resume = model<Resume>();
    resumeSnapshot?: Resume;
    isPdfVisible = signal(true);
    settingsFields: FormlyFieldConfig[] = [];
    summaryFields: FormlyFieldConfig[] = [];
    skillsFields: FormlyFieldConfig[] = [];
    experienceFields: FormlyFieldConfig[] = [];
    educationFields: FormlyFieldConfig[] = [];
    SectionType = SectionType;
    expandLastPanel?: boolean;
    safePdfUrl = signal<SafeResourceUrl | null>(null);
    isLoadingPdf = signal(false);
    pdfError = signal(false);
    private lastFetchedResumeId?: string;
    private lastFetchedUpdated?: string;
    private currentBlobUrl?: string;
    private readonly fetchTrigger$ = new Subject<Resume>();

    @ViewChildren(MatExpansionPanel)
    expansionPanels!: QueryList<MatExpansionPanel>;

    get resumeHasChanged(): boolean {
        return !isEqual(this.resume(), this.resumeSnapshot);
    }

    get showAddSection(): boolean {
        const { sections } = this.resume() ?? {};
        if (sections?.length) {
            return sections.length < defaultSections.length;
        }

        return true;
    }

    get unusedSections(): SectionType[] {
        return [...defaultSections].filter((section) => {
            return !this.resume()?.sections?.includes(section);
        });
    }

    constructor() {
        effect(() => {
            this.resumeSnapshot = cloneDeep(this.savedResume());
        });

        effect(() => {
            const resume = this.resume();
            this.setFormFields();
            if (this.expandLastPanel) {
                setTimeout(() => {
                    this.expansionPanels.last.expanded = true;
                    this.expandLastPanel = false;
                });
            }
            if (
                resume?.id &&
                (resume.id !== this.lastFetchedResumeId ||
                    resume.updated !== this.lastFetchedUpdated)
            ) {
                this.fetchPdf(resume);
            }
        });

        // Single pipeline — switchMap cancels any in-flight request when a new
        // fetch is triggered, preventing stale PDFs from overwriting newer ones.
        this.fetchTrigger$.pipe(
            tap(() => {
                this.isLoadingPdf.set(true);
                this.pdfError.set(false);
                this.safePdfUrl.set(null);
                // Clear immediately so openInNewTab / onDownloadResume can't
                // serve the old cached blob while the new request is in flight.
                if (this.currentBlobUrl) {
                    URL.revokeObjectURL(this.currentBlobUrl);
                    this.currentBlobUrl = undefined;
                }
            }),
            switchMap((resume) =>
                this.userService.isAuthenticated$.pipe(
                    take(1),
                    switchMap((isAuthenticated) => {
                        const { id } = resume;
                        if (isAuthenticated && id) {
                            return this.resumeService.downloadResume(id);
                        }
                        return this.resumeService.downloadGuestResume(resume);
                    }),
                    map((pdf) => ({ pdf, resume })),
                    catchError(() => {
                        this.pdfError.set(true);
                        this.isLoadingPdf.set(false);
                        return EMPTY;
                    }),
                )
            ),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(({ pdf, resume: fetchedResume }) => {
            this.isLoadingPdf.set(false);
            this.currentBlobUrl = URL.createObjectURL(pdf);
            this.safePdfUrl.set(
                this.sanitizer.bypassSecurityTrustResourceUrl(
                    `${this.currentBlobUrl}#toolbar=0`,
                ),
            );
            this.lastFetchedResumeId = fetchedResume.id;
            this.lastFetchedUpdated = fetchedResume.updated;
        });

        // Revoke the cached blob URL when the component is destroyed to avoid
        // accumulating unreleased object URLs over the page lifetime.
        this.destroyRef.onDestroy(() => {
            if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
            }
        });
    }

    ngOnInit(): void {
        this.resumeSnapshot = cloneDeep(this.savedResume());
        this.setFormFields();
    }

    setFormFields(): void {
        this.settingsFields = this.formFieldsService.getSettingsFields();
        this.summaryFields = this.formFieldsService.getSummaryFields();
        this.skillsFields = this.formFieldsService.getSkillsFields();
        this.experienceFields = this.formFieldsService.getExperienceFields();
        this.educationFields = this.formFieldsService.getEducationFields();
    }

    saveChanges(): void {
        const resume = this.resume();

        if (resume) {
            this.saveResume.emit(resume);
        }
    }

    onDeleteResume(): void {
        const config = {
            data: {
                message: 'Are you sure you want to delete this resume?',
                confirmLabel: 'Yes',
                cancelLabel: 'No',
            },
        };
        this.dialog
            .open(MessageDialogComponent, config)
            .afterClosed()
            .subscribe((result) => {
                if (result === MessageDialogResult.Confirm) {
                    const resume = this.resume();
                    if (resume?.id) {
                        this.deleteResume.emit([resume.id]);
                        this.back.emit();
                    }
                }
            });
    }

    exit(): void {
        if (this.resume()?.isNew || this.resumeHasChanged) {
            const config = {
                data: {
                    message: `
                        There are unsaved changes. 
                        Are you sure you want to exit?
                    `,
                    confirmLabel: 'Exit without Saving',
                    cancelLabel: 'Continue Editing',
                    alternateLabel: 'Save and Exit',
                },
            };
            this.dialog
                .open(MessageDialogComponent, config)
                .afterClosed()
                .subscribe((result) => {
                    if (result === MessageDialogResult.Confirm) {
                        this.cancelChanges();
                        this.back.emit();
                    } else if (result === MessageDialogResult.Alternate) {
                        this.saveChanges();
                        this.back.emit();
                    }
                });
        } else {
            this.back.emit();
        }
    }

    cancelChanges(): void {
        this.resume.set(this.resumeSnapshot);
    }

    addSection(section: SectionType): void {
        const resume = this.resume();

        if (resume) {
            this.resume.set(
                new Resume({
                    ...resume,
                    sections: [...(resume.sections ?? []), section],
                }),
            );
            this.expandLastPanel = true;
        }
    }

    removeSection(section: SectionType): void {
        const resume = this.resume();

        if (resume) {
            this.resume.set(
                new Resume({
                    ...resume,
                    sections: [
                        ...(resume.sections ?? []).filter((s) => {
                            return s !== section;
                        }),
                    ],
                }),
            );
        }
    }

    moveSection({ currentIndex, previousIndex }: CdkDragDrop<Section[]>): void {
        const { sections } = this.resume() ?? {};
        if (sections) {
            moveItemInArray(sections, previousIndex, currentIndex);
        }
    }

    openInNewTab(): void {
        const resume = this.resume();
        if (!resume) return;
        if (this.currentBlobUrl) {
            window.open(this.currentBlobUrl);
        } else {
            this.viewResume.emit(resume);
        }
    }

    onDownloadResume(): void {
        const resume = this.resume();
        if (!resume) return;
        if (this.currentBlobUrl) {
            const link = document.createElement('a');
            link.href = this.currentBlobUrl;
            link.download = `${resume.fileName}.pdf`;
            link.click();
        } else {
            this.downloadResume.emit(resume);
        }
    }

    onTailorResume(): void {
        const resume = this.resume();
        if (resume?.id) {
            this.tailorResume.emit(resume);
        }
    }

    togglePdfPanel(): void {
        this.isPdfVisible.update((v) => !v);
    }

    fetchPdf(resume: Resume): void {
        this.fetchTrigger$.next(resume);
    }
}
