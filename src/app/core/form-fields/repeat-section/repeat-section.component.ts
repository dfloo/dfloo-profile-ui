import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FieldArrayType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { FormArray } from '@angular/forms';

@Component({
    selector: 'formly-repeat-section',
    templateUrl: './repeat-section.component.html',
    styleUrl: './repeat-section.component.scss',
    imports: [
    FormlyField,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    DragDropModule,
]
})
export class RepeatSectionComponent extends FieldArrayType {
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
}
