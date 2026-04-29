import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from '@angular/core';


@Component({
    selector: 'flip-book',
    templateUrl: './flip-book.component.html',
    styleUrl: './flip-book.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlipBookComponent {
    open = false;

    private initialPages: Page[] = [
        {
            id: 0,
            front: 'assets/flip-book/page_1_front.png',
            back: 'assets/flip-book/page_1_back.png',
        },
        {
            id: 1,
            front: 'assets/flip-book/page_2_front.png',
            back: 'assets/flip-book/page_2_back.png',
        },
        {
            id: 2,
            front: 'assets/flip-book/page_3_front.png',
            back: 'assets/flip-book/page_3_back.png',
        },
        {
            id: 3,
            front: 'assets/flip-book/page_4_front.png',
            back: 'assets/flip-book/page_4_back.png',
        },
    ];
    pages = signal<Page[]>(this.initialPages);
    reversePages = computed(() => [...this.pages()].reverse());

    close(): void {
        this.open = false;
        this.pages.update((pages) =>
            pages.map((p) => ({ ...p, flipped: false, reverseFlip: false })),
        );
    }

    flipPage({ id }: Page): void {
        this.pages.update((pages) =>
            pages.map((p) => (p.id === id ? { ...p, flipped: true } : p)),
        );
    }

    reverseFlipPage({ id }: Page): void {
        this.pages.update((pages) =>
            pages.map((p) => (p.id === id ? { ...p, reverseFlip: true } : p)),
        );

        setTimeout(() => {
            this.pages.update((pages) =>
                pages.map((p) =>
                    p.id === id
                        ? { ...p, flipped: false, reverseFlip: false }
                        : p,
                ),
            );
        }, 1000);
    }
}

interface Page {
    id: number;
    front: string;
    back: string;
    flipped?: boolean;
    reverseFlip?: boolean;
}
