import { Component, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/core';
import { FormsModule } from '@angular/forms';

import { COLOR_MAP, HUE_MAP } from './color-names';

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatSlider,
        MatSliderThumb,
    ],
})
export class ColorPickerComponent extends FieldType implements OnInit {
    hue = 0;

    get displayName(): string {
        return COLOR_MAP.get(this.hue)?.label ?? '';
    }

    get color(): string {
        return COLOR_MAP.get(this.hue)?.value ?? '';
    }

    ngOnInit(): void {
        const controlValue = this.formControl?.value;
        const defaultValue = this.props['defaultValue'];

        if (this.isValid(controlValue)) {
            this.hue = HUE_MAP.get(controlValue) ?? 0;
        } else if (this.isValid(defaultValue)) {
            this.hue = HUE_MAP.get(defaultValue) ?? 0;
            if (this.formControl.value !== defaultValue) {
                this.formControl.setValue(defaultValue);
            }
        }
    }

    onHueChange(event: Event): void {
        const hue = Number((event.target as HTMLInputElement).value);
        this.hue = hue ?? 0;
        this.formControl.setValue(this.color);
    }

    onColorChange(color: string): void {
        this.formControl.setValue(color);
    }

    private isValid(value?: string | null): boolean {
        return value !== null && value !== undefined && value !== '';
    }
}
