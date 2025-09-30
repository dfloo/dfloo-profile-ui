import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

import { HeaderComponent } from './app-header.component';

describe('HeaderComponent', () => {
    let component: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;
    let loader: HarnessLoader;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    const AUTH0_CLIENT = new InjectionToken('auth0.client');

    const setup = async (authenticated: boolean) => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            imports: [HeaderComponent, WrapperComponent],
            providers: [
                { provide: AUTH0_CLIENT, useValue: {} },
                {
                    provide: AuthService,
                    useValue: {
                        isAuthenticated$: of(authenticated),
                        loginWithPopup: jasmine.createSpy('loginWithPopup'),
                        logout: jasmine.createSpy('logout')
                    }
                },
                { provide: MatDialog, useValue: mockDialog }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(WrapperComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    describe('Unauthenticated', () => {
        beforeEach(async () => {
            await setup(false);
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });
    
        it('should display the title', () => {
            const title = fixture.nativeElement.querySelector('h1');
            expect(title.textContent).toContain('My Title');
        });
    
        it('should emit toggleSidenav signal', async () => {
            spyOn(component.header.toggleSidenav, 'emit')
            await clickButtonByText('menu')
    
            expect(component.header.toggleSidenav.emit).toHaveBeenCalled();
        });
    
        it('should open the user menu', async () => {
            await clickButtonByText('account_circle');
            const menu = await loader.getHarness(MatMenuHarness);
    
            expect(await menu.isOpen()).toBeTrue();
        });
    
        it('should show the unauthenticated user menu options', async () => {
            const options = await getUserMenuOptions();
            
            expect(options).toEqual(['Sign Up', 'Log In']);
        });
    });

    describe('Authenticated', () => {
        beforeEach(async () => {
            await setup(true);
        });

        it('should show the authenticated user menu options', async () => {
            const options = await getUserMenuOptions();
            
            expect(options).toEqual(['Profile', 'Settings', 'Log Out']);
        });
    });

    const clickButtonByText = async (text: string) => {
        (await loader.getHarness(MatButtonHarness.with({ text }))).click();
    }

    const getUserMenuOptions = async (): Promise<string[]> => {
        await clickButtonByText('account_circle');
        const menu = await loader.getHarness(MatMenuHarness);

        return Promise.all((await menu.getItems()).map(i => i.getText()));
    };
});


@Component({
    selector: 'wrapper',
    template: `
        <app-header
            [title]="title"
        ></app-header>
    `,
    imports: [HeaderComponent]
})
class WrapperComponent {
    @ViewChild(HeaderComponent) header!: HeaderComponent;
    title = 'My Title'
}
