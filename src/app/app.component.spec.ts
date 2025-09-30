import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { App } from './app.component';

describe('App', () => {
    let app: App;
    let fixture: ComponentFixture<App>;
    const AUTH0_CLIENT = new InjectionToken('auth0.client');

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                { provide: AUTH0_CLIENT, useValue: {} },
                {
                    provide: AuthService,
                    useValue: {
                        isAuthenticated$: of(false),
                        loginWithPopup: jasmine.createSpy('loginWithPopup'),
                        logout: jasmine.createSpy('logout'),
                    }
                }
            ]
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
