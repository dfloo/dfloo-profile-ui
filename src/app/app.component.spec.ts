import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
    let app: App;
    let fixture: ComponentFixture<App>;

    beforeEach(async () => {
        await TestBed
            .configureTestingModule({ imports: [App] })
            .compileComponents();
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
