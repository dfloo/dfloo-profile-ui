import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

import { ResumeService } from '@api/resume';

import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    let mockResumeService: jasmine.SpyObj<ResumeService>;

    beforeEach(async () => {
        mockResumeService = jasmine.createSpyObj('ResumeService', [
            'downloadDefaultResume',
        ]);
        await TestBed.configureTestingModule({
            imports: [WelcomeComponent],
            providers: [
                {
                    provide: ResumeService,
                    useValue: mockResumeService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should expose welcome cards', () => {
        expect(component.welcomeCards).toBeDefined();
        expect(component.welcomeCards.length).toBeGreaterThan(0);
        expect(component.welcomeCards[0].text).toContain("Hi, I'm Devin");
    });

    it('getBackground returns asset url', () => {
        const card = component.welcomeCards[0];
        const bg = component.getBackground(card);
        expect(bg).toEqual({
            'background-image': `url('/assets/${card.background}')`
        });
    });

    it('viewSocial opens correct urls', () => {
        spyOn(window, 'open');

        component.viewSocial('github');
        expect(window.open).toHaveBeenCalledWith('https://github.com/dfloo');

        (window.open as jasmine.Spy).calls.reset();

        component.viewSocial('linkedin');
        expect(window.open).toHaveBeenCalledWith(
            'https://www.linkedin.com/in/dfloo'
        );
    });

    it('viewResume downloads resume and opens blob url', () => {
        const blob = new Blob(['pdf'], { type: 'application/pdf' });
        mockResumeService.downloadDefaultResume.and.returnValue(of(blob));

        spyOn(URL, 'createObjectURL').and.returnValue('blob:mock');
        spyOn(window, 'open');

        component.viewResume();

        expect(mockResumeService.downloadDefaultResume).toHaveBeenCalled();
        expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
        expect(window.open).toHaveBeenCalledWith('blob:mock');
    });

    it('shows spinner and disables resume button while downloading', () => {
        const download$ = new Subject<Blob>();
        mockResumeService.downloadDefaultResume.and.returnValue(
            download$.asObservable()
        );

        const resumeButton = fixture.debugElement.query(
            By.css('.resume-button')
        ).nativeElement as HTMLButtonElement;

        resumeButton.click();
        fixture.detectChanges();

        expect(component.isDownloadingResume()).toBeTrue();
        expect(resumeButton.disabled).toBeTrue();
        expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeTruthy();
    });

    it('hides spinner and re-enables button when download completes', () => {
        const download$ = new Subject<Blob>();
        mockResumeService.downloadDefaultResume.and.returnValue(
            download$.asObservable()
        );

        const resumeButton = fixture.debugElement.query(
            By.css('.resume-button')
        ).nativeElement as HTMLButtonElement;

        resumeButton.click();
        fixture.detectChanges();

        download$.complete();
        fixture.detectChanges();

        expect(component.isDownloadingResume()).toBeFalse();
        expect(resumeButton.disabled).toBeFalse();
        expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeNull();
    });

    it('prevents duplicate resume download requests while downloading', () => {
        const download$ = new Subject<Blob>();
        mockResumeService.downloadDefaultResume.and.returnValue(
            download$.asObservable()
        );

        component.viewResume();
        component.viewResume();

        expect(
            mockResumeService.downloadDefaultResume
        ).toHaveBeenCalledTimes(1);
    });
});
