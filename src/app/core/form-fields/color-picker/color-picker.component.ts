import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    imports: [ColorPickerDirective],
})
export class ColorPickerComponent extends FieldType {
    color = '#000000';

    getDisplayName(color: string): string {
        return `getDisplayName: ${color}`;
    }
}
