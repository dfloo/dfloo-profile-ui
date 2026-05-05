import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

import { MeetingRequestService } from '@api/meeting-request';
import { SnackBarService } from '@core/services';

import { MeetingRequestModalComponent } from './request-meeting-modal.component';

describe('MeetingRequestModalComponent', () => {
    let component: MeetingRequestModalComponent;
    let fixture: ComponentFixture<MeetingRequestModalComponent>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<MeetingRequestModalComponent>>;
    let mockMeetingRequestService: jasmine.SpyObj<MeetingRequestService>;
    let mockSnackBarService: jasmine.SpyObj<SnackBarService>;

    const validFormValue = { name: 'Test User', email: 'test@example.com', message: 'Let us connect' };

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockMeetingRequestService = jasmine.createSpyObj('MeetingRequestService', ['createMeetingRequest']);
        mockSnackBarService = jasmine.createSpyObj('SnackBarService', ['open']);

        await TestBed.configureTestingModule({
            imports: [MeetingRequestModalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MeetingRequestService, useValue: mockMeetingRequestService },
                { provide: SnackBarService, useValue: mockSnackBarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MeetingRequestModalComponent);
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
            expect(mockMeetingRequestService.createMeetingRequest).not.toHaveBeenCalled();
        });

        it('should call createMeetingRequest with the form value', () => {
            component.form.setValue(validFormValue);
            mockMeetingRequestService.createMeetingRequest.and.returnValue(of(undefined));

            component.submit();

            expect(mockMeetingRequestService.createMeetingRequest).toHaveBeenCalledWith(validFormValue);
        });

        it('should show a snackbar and close the dialog on success', () => {
            component.form.setValue(validFormValue);
            mockMeetingRequestService.createMeetingRequest.and.returnValue(of(undefined));

            component.submit();

            expect(mockSnackBarService.open).toHaveBeenCalledWith(jasmine.stringContaining('Meeting request'));
            expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should set isSubmitting to true while the request is in flight', () => {
            const submit$ = new Subject<void>();
            component.form.setValue(validFormValue);
            mockMeetingRequestService.createMeetingRequest.and.returnValue(submit$.asObservable());

            component.submit();
            expect(component.isSubmitting()).toBeTrue();

            submit$.complete();
            expect(component.isSubmitting()).toBeFalse();
        });

        it('should prevent duplicate submissions while a request is in flight', () => {
            const submit$ = new Subject<void>();
            component.form.setValue(validFormValue);
            mockMeetingRequestService.createMeetingRequest.and.returnValue(submit$.asObservable());

            component.submit();
            component.submit();

            expect(mockMeetingRequestService.createMeetingRequest).toHaveBeenCalledTimes(1);
        });
    });
});
