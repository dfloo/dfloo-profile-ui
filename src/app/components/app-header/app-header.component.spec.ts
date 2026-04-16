import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { UserService } from '@core/services';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from './app-header.component';

describe('HeaderComponent', () => {
    let component: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;
    let loader: HarnessLoader;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockUserService: jasmine.SpyObj<UserService>;

    const setup = async (
        isAuthenticated: boolean,
        profilePictureUrl?: string,
    ) => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        mockUserService = jasmine.createSpyObj('UserService', [
            'login',
            'signup',
            'logout',
            'hasRole',
        ]);
        mockUserService.isAuthenticated$ = of(isAuthenticated);
        mockUserService.profilePictureUrl$ = of(profilePictureUrl);

        await TestBed.configureTestingModule({
            imports: [HeaderComponent, WrapperComponent],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: MatDialog, useValue: mockDialog },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WrapperComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    describe('Unauthenticated', () => {
        beforeEach(async () => {
            await setup(false, 'https://example.com/picture.png');
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should display the title', () => {
            const title = fixture.nativeElement.querySelector('.page-title');
            expect(title.textContent).toContain('My Title');
        });

        it('should emit toggleSidenav signal', async () => {
            spyOn(component.header.toggleSidenav, 'emit');
            await clickButtonByText('menu');

            expect(component.header.toggleSidenav.emit).toHaveBeenCalled();
        });

        it('should open the user menu', async () => {
            await clickButtonByText('account_circle');
            const menu = await loader.getHarness(MatMenuHarness);

            expect(await menu.isOpen()).toBeTrue();
        });

        it('should show account_circle in non-production when profile picture exists', async () => {
            const profilePicture = fixture.nativeElement.querySelector(
                'img.profile-picture',
            );
            const accountIcon = fixture.nativeElement.querySelector('.account-icon');

            expect(profilePicture).toBeNull();
            expect(accountIcon?.textContent?.trim()).toBe('account_circle');
        });

        it('should show the unauthenticated user menu options', async () => {
            const options = await getUserMenuOptions();

            expect(options).toEqual(['Settings', 'Sign Up', 'Log In']);
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

    describe('Production avatar', () => {
        const originalProduction = environment.production;

        beforeEach(async () => {
            environment.production = true;
            await setup(true, 'https://example.com/picture.png');
        });

        afterEach(() => {
            environment.production = originalProduction;
        });

        it('should show profile picture when available in production', () => {
            const profilePicture = fixture.nativeElement.querySelector(
                'img.profile-picture',
            );

            expect(profilePicture).not.toBeNull();
            expect(profilePicture?.getAttribute('src')).toBe(
                'https://example.com/picture.png',
            );
        });
    });

    const clickButtonByText = async (text: string) => {
        (await loader.getHarness(MatButtonHarness.with({ text }))).click();
    };

    const clickButtonBySelector = async (selector: string) => {
        (await loader.getHarness(MatButtonHarness.with({ selector }))).click();
    };

    const getUserMenuOptions = async (): Promise<string[]> => {
        await clickButtonBySelector('.mat-mdc-menu-trigger');
        const menu = await loader.getHarness(MatMenuHarness);

        return Promise.all((await menu.getItems()).map((i) => i.getText()));
    };
});

@Component({
    selector: 'wrapper',
    template: ` <app-header [title]="title"></app-header> `,
    imports: [HeaderComponent],
})
class WrapperComponent {
    @ViewChild(HeaderComponent) header!: HeaderComponent;
    title = 'My Title';
}
