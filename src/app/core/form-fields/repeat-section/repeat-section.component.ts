import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
    selector: 'formly-repeat-section',
    templateUrl: './repeat-section.component.html',
    styleUrl: './repeat-section.component.scss',
    imports: [
    FormlyField,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule
]
})
export class RepeatSectionComponent extends FieldArrayType {
    getSubsectionLabel(index: number): string {
        const key = this.props['subsectionKey'];
        const model = this.field.model[index];

        if (model && model[key]) {
            return model[key]
        }

        return this.props['subsectionLabel']
    }
}
