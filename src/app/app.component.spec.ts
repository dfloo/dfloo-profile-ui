import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserService } from '@core/services';
import { App } from './app.component';

describe('App', () => {
    let app: App;
    let fixture: ComponentFixture<App>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        isAuthenticated$: of(false),
                        profilePictureUrl$: of(undefined),
                        login: jasmine.createSpy('login'),
                        signup: jasmine.createSpy('signup'),
                        logout: jasmine.createSpy('logout'),
                    },
                },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(App);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should render app-header component', () => {
        const header = fixture.nativeElement.querySelector('app-header');
        expect(header).toBeTruthy();
    });
});
