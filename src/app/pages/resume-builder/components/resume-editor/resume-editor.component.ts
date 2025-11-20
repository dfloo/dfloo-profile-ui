import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';
import {
    Component,
    effect,
    inject,
    model,
    OnInit,
    output,
    QueryList,
    ViewChildren
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { cloneDeep, isEqual } from 'lodash-es';

import { ProfileFormComponent } from '@components/profile-form';
import {
    WarningDialogComponent,
    WarningDialogResult
} from '@components/warning-dialog';
import { defaultSections, Resume, Section, SectionType } from '@models/resume';

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
        MatTooltip,
        ProfileFormComponent,
        ResumeSectionFormComponent
    ]
})
export class ResumeEditorComponent implements OnInit {
    private formFieldsService = inject(ResumeFormFieldsService);
    private dialog = inject(MatDialog);

    saveResume = output<Resume>();
    viewResume = output<Resume>();
    downloadResume = output<Resume>();
    deleteResume = output<string[]>();
    back = output();
    resume = model<Resume>();
    resumeSnapshot?: Resume;
    settingsFields: FormlyFieldConfig[] = [];
    summaryFields: FormlyFieldConfig[] = [];
    skillsFields: FormlyFieldConfig[] = [];
    experienceFields: FormlyFieldConfig[] = [];
    educationFields: FormlyFieldConfig[] = [];
    SectionType = SectionType;
    expandLastPanel?: boolean;

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
        return [...defaultSections].filter(section => {
            return !this.resume()?.sections?.includes(section)
        });
    }

    constructor() {
        effect(() => {
            this.resumeSnapshot = cloneDeep(this.resume());
            if (this.expandLastPanel) {
                setTimeout(() => {
                    this.expansionPanels.last.expanded = true;
                    this.expandLastPanel = false;
                })
            }
        });
    }

    ngOnInit(): void {
        this.settingsFields = this.formFieldsService.getSettingsFields();
        this.summaryFields = this.formFieldsService.getSummaryFields();
        this.skillsFields = this.formFieldsService.getSkillsFields();
        this.experienceFields = this.formFieldsService.getExperienceFields();
        this.educationFields = this.formFieldsService.getEducationFields();
    }

    onDeleteResume(): void {
        const config = {
            data: {
                message: 'Are you sure you want to delete this resume?',
                confirmLabel: 'Yes',
                cancelLabel: 'No'
            },

        }
        this.dialog.open(WarningDialogComponent, config)
            .afterClosed()
            .subscribe(result => {
                if (result === WarningDialogResult.Confirm) {
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
                    alternateLabel: 'Save and Exit'
                },
    
            }
            this.dialog.open(WarningDialogComponent, config)
                .afterClosed()
                .subscribe(result => {
                    if (result === WarningDialogResult.Confirm) {
                        this.cancelChanges();
                        this.back.emit();
                    } else if (result === WarningDialogResult.Alternate) {
                        const resume = this.resume()
                        if (resume) {
                            this.saveResume.emit(resume)
                        }
                        this.back.emit();
                    }
                })
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
            this.resume.set(new Resume({
                ...resume,
                sections: [...(resume.sections ?? []), section]
            }));
            this.expandLastPanel = true;
        }
    }

    removeSection(section: SectionType): void {
        const resume = this.resume();

        if (resume) {
            this.resume.set(new Resume({
                ...resume,
                sections: [...(resume.sections ?? []).filter(s => {
                    return s !== section
                })]
            }));
        }
    }

    moveSection({ currentIndex, previousIndex }: CdkDragDrop<Section[]>): void {
        const { sections } = this.resume() ?? {};
        if (sections) {
            moveItemInArray(
                sections,
                previousIndex,
                currentIndex
            );
        }
    }
}
