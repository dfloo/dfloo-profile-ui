import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { withFormlyFieldTextArea } from '@ngx-formly/material/textarea';
import { of, Subject } from 'rxjs';

import { SignupService } from '@api/signup';
import { SnackBarService } from '@core/services';

import { SignupModalComponent } from './signup-modal.component';

describe('SignupModalComponent', () => {
    let component: SignupModalComponent;
    let fixture: ComponentFixture<SignupModalComponent>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<SignupModalComponent>>;
    let mockSignupService: jasmine.SpyObj<SignupService>;
    let mockSnackBarService: jasmine.SpyObj<SnackBarService>;

    const validFormValue = { name: 'Test User', email: 'test@example.com', reason: 'I want access' };

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockSignupService = jasmine.createSpyObj('SignupService', ['createSignupRequest']);
        mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['open']);

        await TestBed.configureTestingModule({
            imports: [SignupModalComponent],
            providers: [
                provideFormlyCore([withFormlyFormField(), withFormlyFieldInput(), withFormlyFieldTextArea()]),
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: SignupService, useValue: mockSignupService },
                { provide: SnackBarService, useValue: mockSnackBarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SignupModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form should be invalid when empty', () => {
        expect(component.form.invalid).toBeTrue();
    });

    it('form should be valid when all required fields are filled', () => {
        component.form.setValue(validFormValue);
        expect(component.form.valid).toBeTrue();
    });

    it('form should be invalid when email is malformed', () => {
        component.form.setValue({ ...validFormValue, email: 'not-an-email' });
        expect(component.form.invalid).toBeTrue();
    });

    describe('#submit', () => {
        it('should not call the service when form is invalid', () => {
            component.submit();
            expect(mockSignupService.createSignupRequest).not.toHaveBeenCalled();
        });

        it('should call createSignupRequest with the form value', () => {
            component.form.setValue(validFormValue);
            mockSignupService.createSignupRequest.and.returnValue(of(undefined));

            component.submit();

            expect(mockSignupService.createSignupRequest).toHaveBeenCalledWith(validFormValue);
        });

        it('should show a snackbar and close the dialog on success', () => {
            component.form.setValue(validFormValue);
            mockSignupService.createSignupRequest.and.returnValue(of(undefined));

            component.submit();

            expect(mockSnackBarService.open).toHaveBeenCalledWith(jasmine.stringContaining('Signup'));
            expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should set isSubmitting to true while the request is in flight', () => {
            const submit$ = new Subject<void>();
            component.form.setValue(validFormValue);
            mockSignupService.createSignupRequest.and.returnValue(submit$.asObservable());

            component.submit();
            expect(component.isSubmitting()).toBeTrue();

            submit$.complete();
            expect(component.isSubmitting()).toBeFalse();
        });

        it('should prevent duplicate submissions while a request is in flight', () => {
            const submit$ = new Subject<void>();
            component.form.setValue(validFormValue);
            mockSignupService.createSignupRequest.and.returnValue(submit$.asObservable());

            component.submit();
            component.submit();

            expect(mockSignupService.createSignupRequest).toHaveBeenCalledTimes(1);
        });
    });
});
