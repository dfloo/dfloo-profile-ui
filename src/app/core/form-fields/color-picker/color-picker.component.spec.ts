import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';
import { FormControl } from '@angular/forms';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColorPickerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
