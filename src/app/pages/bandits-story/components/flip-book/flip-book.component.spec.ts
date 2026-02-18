import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick
} from '@angular/core/testing';

import { FlipBookComponent } from './flip-book.component';

describe('FlipBookComponent', () => {
    let component: FlipBookComponent;
    let fixture: ComponentFixture<FlipBookComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlipBookComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlipBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initial pages are defined and have assets', () => {
        const pages = component.pages();
        expect(pages.length).toBe(4);
        pages.forEach((p) => {
            expect(p.front).toContain('assets/');
            expect(p.back).toContain('assets/');
        });
    });

    it('reversePages computed returns reversed order', () => {
        const pages = component.pages();
        const reversed = component.reversePages();
        expect(reversed.length).toBe(pages.length);
        expect(reversed[0].id).toBe(pages[pages.length - 1].id);
    });

    it('flipPage flips the correct page', () => {
        component.flipPage({ id: 1, front: '', back: '' });

        const p = component.pages().find((x) => x.id === 1);
        expect(p?.flipped).toBeTrue();
    });

    it('reverseFlipPage sets reverseFlip then clears after timeout', fakeAsync(() => {
        component.reverseFlipPage({ id: 2, front: '', back: '' });

        let p = component.pages().find((x) => x.id === 2);
        expect(p?.reverseFlip).toBeTrue();

        tick(1000);
        fixture.detectChanges();

        p = component.pages().find((x) => x.id === 2);
        expect(p?.reverseFlip).toBeFalse();
        expect(p?.flipped).toBeFalse();
    }));

    it('close resets flipped and reverseFlip flags and closes', () => {
        component.pages.update((pages) =>
            pages.map((p) => ({ ...p, flipped: true, reverseFlip: true })),
        );
        component.open = true;

        component.close();

        expect(component.open).toBeFalse();
        component.pages().forEach((p) => {
            expect(p.flipped).toBeFalse();
            expect(p.reverseFlip).toBeFalse();
        });
    });
});
