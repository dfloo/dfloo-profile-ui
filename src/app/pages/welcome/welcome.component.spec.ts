import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
