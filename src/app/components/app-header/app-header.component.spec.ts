import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './app-header.component';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed
            .configureTestingModule({ imports: [HeaderComponent] })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle sidenav state', () => {
        const sidenavOpen = component.sidenavOpen();
        component.toggleSidenav();

        expect(component.sidenavOpen()).toBe(!sidenavOpen);
    });
});
