import { Component, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
    MatOption,
    MatSelect,
    MatSelectTrigger
} from '@angular/material/select';
import { FieldType } from '@ngx-formly/core';
import { FormsModule } from '@angular/forms';

import { Color, COLOR_MAP, COLOR_OPTIONS, HUE_MAP } from './colors';

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.scss',
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatSelect,
        MatSelectTrigger,
        MatOption,
        MatLabel,
        MatSliderModule,
        MatIcon,
    ],
})
export class ColorPickerComponent extends FieldType implements OnInit {
    hue = 0;
    colorFilter = '';

    get filteredColors(): Color[] {
        const filter = this.colorFilter.trim().toLowerCase();
        if (!filter) {
            return COLOR_OPTIONS
        };

        return COLOR_OPTIONS.filter(
            ({ label }) => (label.toLowerCase().includes(filter))
        );
    }

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
        const mappedHue = HUE_MAP.get(color);
        if (mappedHue !== undefined) {
            this.hue = mappedHue;
        }
        if (this.formControl.value !== color) {
            this.formControl.setValue(color);
        }
    }

    private isValid(value?: string | null): boolean {
        return value !== null && value !== undefined && value !== '';
    }
}
