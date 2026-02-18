import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

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
});
