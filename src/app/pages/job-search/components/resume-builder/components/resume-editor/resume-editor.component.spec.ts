import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subject, throwError } from 'rxjs';

import { MessageDialogResult } from '@components/message-dialog';
import { Resume, SectionType } from '@models/resume';
import { ResumeService } from '@api/resume';
import { UserService } from '@core/services';
import { ResumeFormFieldsService } from '../../services';
import { ResumeSectionFormComponent } from '../resume-section-form';
import { ProfileFormComponent } from '@components/profile-form';
import { ResumeEditorComponent } from './resume-editor.component';

describe('ResumeEditorComponent', () => {
    let component: ResumeEditorComponent;
    let fixture: ComponentFixture<ResumeEditorComponent>;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;
    let mockUserService: { isAuthenticated$: Observable<boolean> };
    let mockFormFieldsService: jasmine.SpyObj<ResumeFormFieldsService>;

    const mockResume = Resume.normalize(Resume.getMockDTO());
    const savedResume = new Resume({ ...mockResume, id: 'resume-1', isNew: false });
    const newResume = new Resume({ ...mockResume, id: undefined, isNew: true });

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        mockResumeService = jasmine.createSpyObj('ResumeService', [
            'downloadResume',
            'downloadGuestResume',
        ]);
        mockUserService = { isAuthenticated$: of(true) };
        mockFormFieldsService = jasmine.createSpyObj('ResumeFormFieldsService', [
            'getSettingsFields',
            'getSummaryFields',
            'getSkillsFields',
            'getExperienceFields',
            'getEducationFields',
        ]);
        mockFormFieldsService.getSettingsFields.and.returnValue([]);
        mockFormFieldsService.getSummaryFields.and.returnValue([]);
        mockFormFieldsService.getSkillsFields.and.returnValue([]);
        mockFormFieldsService.getExperienceFields.and.returnValue([]);
        mockFormFieldsService.getEducationFields.and.returnValue([]);

        await TestBed.configureTestingModule({
            imports: [ResumeEditorComponent],
            providers: [
                provideNoopAnimations(),
                { provide: MatDialog, useValue: mockDialog },
                { provide: ResumeService, useValue: mockResumeService },
                { provide: UserService, useValue: mockUserService },
                { provide: ResumeFormFieldsService, useValue: mockFormFieldsService },
            ],
        })
            .overrideComponent(ResumeEditorComponent, {
                remove: { providers: [ResumeFormFieldsService] },
            })
            .overrideComponent(ResumeSectionFormComponent, { set: { template: '' } })
            .overrideComponent(ProfileFormComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(ResumeEditorComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.componentRef.setInput('resume', savedResume);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    // ---------------------------------------------------------------------------
    // PDF Visibility (isPdfVisible)
    // ---------------------------------------------------------------------------

    describe('isPdfVisible', () => {
        it('should default to true', () => {
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            expect(component.isPdfVisible()).toBeTrue();
        });

        it('should render the pdf-viewer-panel when visible and resume is saved', () => {
            mockResumeService.downloadResume.and.returnValue(of(new Blob()));
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            const panel = fixture.debugElement.query(By.css('.pdf-viewer-panel'));
            expect(panel).not.toBeNull();
        });

        it('should hide the pdf-viewer-panel when isPdfVisible is false', () => {
            mockResumeService.downloadResume.and.returnValue(of(new Blob()));
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            component.togglePdfPanel();
            fixture.detectChanges();

            const panel = fixture.debugElement.query(By.css('.pdf-viewer-panel'));
            expect(panel).toBeNull();
        });

        it('should never render the pdf-viewer-panel for a new resume', () => {
            fixture.componentRef.setInput('resume', newResume);
            fixture.detectChanges();

            const panel = fixture.debugElement.query(By.css('.pdf-viewer-panel'));
            expect(panel).toBeNull();
        });
    });

    // ---------------------------------------------------------------------------
    // togglePdfPanel
    // ---------------------------------------------------------------------------

    describe('togglePdfPanel', () => {
        beforeEach(() => {
            mockResumeService.downloadResume.and.returnValue(of(new Blob()));
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
        });

        it('should toggle isPdfVisible from true to false', () => {
            expect(component.isPdfVisible()).toBeTrue();
            component.togglePdfPanel();
            expect(component.isPdfVisible()).toBeFalse();
        });

        it('should toggle isPdfVisible from false back to true', () => {
            component.togglePdfPanel();
            expect(component.isPdfVisible()).toBeFalse();
            component.togglePdfPanel();
            expect(component.isPdfVisible()).toBeTrue();
        });

        it('should show the toggle button only when resume is saved', () => {
            fixture.detectChanges();
            const toggleBtn = fixture.debugElement.query(
                By.css('[aria-label="Hide PDF Preview"]'),
            );
            expect(toggleBtn).not.toBeNull();
        });

        it('should not show the toggle button for a new resume', () => {
            fixture.componentRef.setInput('resume', newResume);
            fixture.detectChanges();

            const toggleBtn = fixture.debugElement.query(
                By.css('[aria-label="Hide PDF Preview"],[aria-label="Show PDF Preview"]'),
            );
            expect(toggleBtn).toBeNull();
        });

        it('should update toggle button aria-label when hidden', () => {
            component.togglePdfPanel();
            fixture.detectChanges();

            const toggleBtn = fixture.debugElement.query(
                By.css('[aria-label="Show PDF Preview"]'),
            );
            expect(toggleBtn).not.toBeNull();
        });
    });

    // ---------------------------------------------------------------------------
    // PDF fetching
    // ---------------------------------------------------------------------------

    describe('fetchPdf', () => {
        it('should call downloadResume when authenticated and resume has id', (done) => {
            const pdfBlob = new Blob(['%PDF'], { type: 'application/pdf' });
            mockResumeService.downloadResume.and.returnValue(of(pdfBlob));

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            // fetchPdf is called by effect when resume has id
            setTimeout(() => {
                expect(mockResumeService.downloadResume).toHaveBeenCalledWith(savedResume.id as string);
                expect(component.isLoadingPdf()).toBeFalse();
                expect(component.pdfError()).toBeFalse();
                done();
            });
        });

        it('should call downloadGuestResume when not authenticated', (done) => {
            mockUserService.isAuthenticated$ = of(false);
            const pdfBlob = new Blob(['%PDF'], { type: 'application/pdf' });
            mockResumeService.downloadGuestResume.and.returnValue(of(pdfBlob));

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            setTimeout(() => {
                expect(mockResumeService.downloadGuestResume).toHaveBeenCalledWith(savedResume);
                done();
            });
        });

        it('should set pdfError to true on failure', (done) => {
            mockResumeService.downloadResume.and.returnValue(
                throwError(() => new Error('Server error')),
            );

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            setTimeout(() => {
                expect(component.pdfError()).toBeTrue();
                expect(component.isLoadingPdf()).toBeFalse();
                done();
            });
        });

        it('should set isLoadingPdf to true while fetching', () => {
            // Use a subject that never emits so loading stays true
            const pending = new Subject<Blob>();
            mockResumeService.downloadResume.and.returnValue(pending.asObservable());

            component.fetchPdf(savedResume);
            fixture.detectChanges();

            expect(component.isLoadingPdf()).toBeTrue();
        });

        it('should show the pdf-loading spinner while fetching', () => {
            const pending = new Subject<Blob>();
            mockResumeService.downloadResume.and.returnValue(pending.asObservable());

            fixture.componentRef.setInput('resume', savedResume);
            component.fetchPdf(savedResume);
            fixture.detectChanges();

            const spinner = fixture.debugElement.query(By.css('.pdf-loading'));
            expect(spinner).not.toBeNull();
        });

        it('should show the pdf-error state when pdfError is true', () => {
            mockResumeService.downloadResume.and.returnValue(
                throwError(() => new Error('fail')),
            );

            fixture.componentRef.setInput('resume', savedResume);
            component.fetchPdf(savedResume);
            fixture.detectChanges();

            const errorEl = fixture.debugElement.query(By.css('.pdf-error'));
            expect(errorEl).not.toBeNull();
        });
    });

    // ---------------------------------------------------------------------------
    // PDF viewer panel visibility interaction with isPdfVisible
    // ---------------------------------------------------------------------------

    describe('pdf viewer panel conditional rendering', () => {
        it('should show iframe when pdf is loaded and visible', (done) => {
            const pdfBlob = new Blob(['%PDF'], { type: 'application/pdf' });
            mockResumeService.downloadResume.and.returnValue(of(pdfBlob));

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            setTimeout(() => {
                fixture.detectChanges();
                const iframe = fixture.debugElement.query(By.css('iframe'));
                expect(iframe).not.toBeNull();
                done();
            });
        });

        it('should hide iframe when pdf is loaded but panel is toggled off', (done) => {
            const pdfBlob = new Blob(['%PDF'], { type: 'application/pdf' });
            mockResumeService.downloadResume.and.returnValue(of(pdfBlob));

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            setTimeout(() => {
                component.togglePdfPanel();
                fixture.detectChanges();
                const iframe = fixture.debugElement.query(By.css('iframe'));
                expect(iframe).toBeNull();
                done();
            });
        });
    });

    // ---------------------------------------------------------------------------
    // openInNewTab / onDownloadResume (interact with blob URL set by fetchPdf)
    // ---------------------------------------------------------------------------

    describe('openInNewTab', () => {
        it('should call viewResume output when no blob URL is cached', () => {
            const viewResumeSpy = jasmine.createSpy('viewResume');
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.viewResume.subscribe(viewResumeSpy);

            // Override currentBlobUrl to be undefined
            (component as unknown as Record<string, unknown>)['currentBlobUrl'] = undefined;
            component.openInNewTab();

            expect(viewResumeSpy).toHaveBeenCalledWith(savedResume);
        });
    });

    describe('onDownloadResume', () => {
        it('should emit downloadResume output when no blob URL is cached', () => {
            const downloadResumeSpy = jasmine.createSpy('downloadResume');
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.downloadResume.subscribe(downloadResumeSpy);

            (component as unknown as Record<string, unknown>)['currentBlobUrl'] = undefined;
            component.onDownloadResume();

            expect(downloadResumeSpy).toHaveBeenCalledWith(savedResume);
        });
    });

    // ---------------------------------------------------------------------------
    // resumeHasChanged / saveChanges / cancelChanges
    // ---------------------------------------------------------------------------

    describe('resumeHasChanged', () => {
        it('should return false when resume matches snapshot', () => {
            fixture.componentRef.setInput('resume', savedResume);
            fixture.componentRef.setInput('savedResume', savedResume);
            fixture.detectChanges();
            expect(component.resumeHasChanged).toBeFalse();
        });

        it('should return true when resume differs from snapshot', () => {
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();

            component.resume.set(new Resume({ ...savedResume, fileName: 'changed' }));
            expect(component.resumeHasChanged).toBeTrue();
        });
    });

    describe('saveChanges', () => {
        it('should emit saveResume with current resume', () => {
            const saveResumeSpy = jasmine.createSpy('saveResume');
            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.saveResume.subscribe(saveResumeSpy);

            component.saveChanges();

            expect(saveResumeSpy).toHaveBeenCalledWith(savedResume);
        });
    });

    describe('cancelChanges', () => {
        it('should reset resume to snapshot', () => {
            fixture.componentRef.setInput('resume', savedResume);
            fixture.componentRef.setInput('savedResume', savedResume);
            fixture.detectChanges();

            component.resume.set(new Resume({ ...savedResume, fileName: 'modified' }));
            component.cancelChanges();

            expect(component.resume()?.fileName).toBe(savedResume.fileName);
        });
    });

    // ---------------------------------------------------------------------------
    // Section management
    // ---------------------------------------------------------------------------

    describe('addSection', () => {
        it('should append a new section to the resume', () => {
            const resumeWithNoSections = new Resume({ ...savedResume, sections: [] });
            fixture.componentRef.setInput('resume', resumeWithNoSections);
            fixture.detectChanges();

            component.addSection(SectionType.Summary);

            expect(component.resume()?.sections).toContain(SectionType.Summary);
        });
    });

    describe('removeSection', () => {
        it('should remove the specified section', () => {
            const resumeWithSections = new Resume({
                ...savedResume,
                sections: [SectionType.Summary, SectionType.Skills],
            });
            fixture.componentRef.setInput('resume', resumeWithSections);
            fixture.detectChanges();

            component.removeSection(SectionType.Summary);

            expect(component.resume()?.sections).not.toContain(SectionType.Summary);
            expect(component.resume()?.sections).toContain(SectionType.Skills);
        });
    });

    describe('showAddSection', () => {
        it('should return true when not all sections are present', () => {
            fixture.componentRef.setInput('resume', new Resume({ ...savedResume, sections: [] }));
            fixture.detectChanges();
            expect(component.showAddSection).toBeTrue();
        });

        it('should return false when all sections are present', () => {
            fixture.componentRef.setInput('resume', new Resume({
                ...savedResume,
                sections: [SectionType.Summary, SectionType.Skills, SectionType.Experience, SectionType.Education],
            }));
            fixture.detectChanges();
            expect(component.showAddSection).toBeFalse();
        });
    });

    // ---------------------------------------------------------------------------
    // exit / onDeleteResume (dialog interactions)
    // ---------------------------------------------------------------------------

    describe('exit', () => {
        it('should emit back directly when no unsaved changes', () => {
            const backSpy = jasmine.createSpy('back');
            fixture.componentRef.setInput('resume', savedResume);
            fixture.componentRef.setInput('savedResume', savedResume);
            fixture.detectChanges();
            component.back.subscribe(backSpy);

            component.exit();

            expect(mockDialog.open).not.toHaveBeenCalled();
            expect(backSpy).toHaveBeenCalled();
        });

        it('should open dialog when there are unsaved changes', () => {
            mockDialog.open.and.returnValue({
                afterClosed: () => of(null),
            } as unknown as MatDialogRef<unknown>);

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.resume.set(new Resume({ ...savedResume, fileName: 'changed' }));

            component.exit();

            expect(mockDialog.open).toHaveBeenCalled();
        });

        it('should emit back after confirming exit without saving', () => {
            const backSpy = jasmine.createSpy('back');
            mockDialog.open.and.returnValue({
                afterClosed: () => of(MessageDialogResult.Confirm),
            } as unknown as MatDialogRef<unknown>);

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.resume.set(new Resume({ ...savedResume, fileName: 'changed' }));
            component.back.subscribe(backSpy);

            component.exit();

            expect(backSpy).toHaveBeenCalled();
        });
    });

    describe('onDeleteResume', () => {
        it('should emit deleteResume and back on confirm', () => {
            const deleteResumeSpy = jasmine.createSpy('deleteResume');
            const backSpy = jasmine.createSpy('back');
            mockDialog.open.and.returnValue({
                afterClosed: () => of(MessageDialogResult.Confirm),
            } as unknown as MatDialogRef<unknown>);

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.deleteResume.subscribe(deleteResumeSpy);
            component.back.subscribe(backSpy);

            component.onDeleteResume();

            expect(deleteResumeSpy).toHaveBeenCalledWith([savedResume.id]);
            expect(backSpy).toHaveBeenCalled();
        });

        it('should not emit deleteResume when dialog is cancelled', () => {
            const deleteResumeSpy = jasmine.createSpy('deleteResume');
            mockDialog.open.and.returnValue({
                afterClosed: () => of(null),
            } as unknown as MatDialogRef<unknown>);

            fixture.componentRef.setInput('resume', savedResume);
            fixture.detectChanges();
            component.deleteResume.subscribe(deleteResumeSpy);

            component.onDeleteResume();

            expect(deleteResumeSpy).not.toHaveBeenCalled();
        });
    });
});
