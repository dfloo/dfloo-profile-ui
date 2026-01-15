import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/core';
import { ColorPickerDirective } from 'ngx-color-picker';

import { ColorNameService } from './services';

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    providers: [ColorNameService],
    imports: [
        ColorPickerDirective,
        MatFormField,
        MatInput,
        MatLabel
    ],
})
export class ColorPickerComponent extends FieldType implements OnInit {
    private colorNameService = inject(ColorNameService);
    color = '';

    get displayName(): string {
        return this.colorNameService.getName(this.color);
    }

    ngOnInit(): void {
        const controlValue = this.formControl?.value;
        const defaultValue = this.props['defaultValue'];

        if (this.isValid(controlValue)) {
            this.color = controlValue;
        } else if (this.isValid(defaultValue)) {
            this.color = defaultValue;
            if (this.formControl.value !== defaultValue) {
                this.formControl.setValue(defaultValue);
            }
        }
    }

    onColorChange(color: string): void {
        this.formControl.setValue(color);
    }

    private isValid(value?: string | null): boolean {
        return value !== null && value !== undefined && value !== '';
    }
}
