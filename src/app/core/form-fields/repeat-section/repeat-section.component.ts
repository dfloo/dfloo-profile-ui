import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MatExpansionPanel,
    MatExpansionPanelHeader
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
    FieldArrayType,
    FormlyField,
    FormlyFieldConfig
} from '@ngx-formly/core';

@Component({
    selector: 'formly-repeat-section',
    templateUrl: './repeat-section.component.html',
    styleUrl: './repeat-section.component.scss',
    imports: [
        FormlyField,
        MatButton,
        MatIcon,
        MatTooltip,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        CdkDrag,
        CdkDragHandle,
        CdkDropList
    ]
})
export class RepeatSectionComponent extends FieldArrayType {
    @ViewChildren(MatExpansionPanel)
        expansionPanels!: QueryList<MatExpansionPanel>;

    get sectionName(): string {
        return this.props['sectionName'] ?? '';
    }

    get addText(): string {
        return `Add ${this.sectionName}`;
    }

    get removeText(): string {
        return `Remove ${this.sectionName}`;
    }

    get moveText(): string {
        return `Move ${this.sectionName}`;
    }

    get disableExpansion(): boolean {
        return this.field?.fieldGroup?.length === 0;
    }

    getSubsectionLabel(index: number): string {
        const key = this.props['subsectionKey'];
        const model = this.field.model[index];

        if (model && model[key]) {
            return model[key]
        }

        return this.props['subsectionLabel']
    }

    moveField(event: CdkDragDrop<FormlyFieldConfig[]>): void {
        const { previousIndex, currentIndex } = event;
        const { fieldGroup, model } = this.field;
        const formArray = this.formControl as FormArray;

        if (fieldGroup?.length) {
            moveItemInArray(fieldGroup, previousIndex, currentIndex);
        }

        if (formArray?.length) {
            const control = formArray.at(previousIndex);
            formArray.removeAt(previousIndex);
            formArray.insert(currentIndex, control);
        }

        if (Array.isArray(model) && model.length) {
            const item = model.splice(previousIndex, 1)[0];
            model.splice(currentIndex, 0, item);
        }

        this.field.formControl?.updateValueAndValidity();
    }

    override add(): void {
        super.add();
        if (this.expansionPanels.last) {
            setTimeout(() => {
                this.expansionPanels.last.expanded = true;
            });
        }
    }

    override remove(index: number): void {
        super.remove(index);
        if (this.field?.fieldGroup?.length === 0) {
            this.expansionPanels.last.expanded = false;
        }
    }
}
