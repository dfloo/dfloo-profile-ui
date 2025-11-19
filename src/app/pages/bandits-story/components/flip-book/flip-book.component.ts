import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ResumeService } from '@api/resume';
import { Resume } from '@models/resume';

@Component({
    selector: 'flip-book',
    templateUrl: './flip-book.component.html',
    styleUrl: './flip-book.component.scss',
    imports: [MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlipBookComponent {
    open = false;
    resume = Resume.normalize(Resume.getMockDTO());

    private resumeService = inject(ResumeService);
    private initialPages: Page[] = [
        {
            id: 0,
            front: 'assets/page_1_front.png',
            back: 'assets/page_1_back.png'
        }, {
            id: 1,
            front: 'assets/page_2_front.png',
            back: 'assets/page_2_back.png'
        }, {
            id: 2,
            front: 'assets/page_3_front.png',
            back: 'assets/page_3_back.png'
        }, {
            id: 3,
            front: 'assets/page_4_front.png',
            back: 'assets/page_4_back.png'
        }
    ];
    pages = signal<Page[]>(this.initialPages);
    reversePages = computed(() => ([...this.pages()].reverse()));
    allPagesOpen = signal(false);

    constructor() {
        effect(() => {
            const pages = this.pages();
            if (!pages.some(page => (!page.flipped || page.reverseFlip))) {
                setTimeout(() => (this.allPagesOpen.set(true)), 1000);
            }
        });
    }

    close(): void {
        this.open = false;
        this.pages.update(pages => 
            pages.map(p => ({ ...p, flipped: false, reverseFlip: false }))
        );
        this.allPagesOpen.set(false);
    }
    
    flipPage({ id }: Page): void {
        this.pages.update(pages => 
            pages.map(p => (p.id === id ? { ...p, flipped: true } : p))
        );
    }

    reverseFlipPage({ id }: Page): void {
        this.pages.update(pages =>
            pages.map(p => (p.id === id ? { ...p, reverseFlip: true } : p))
        );

        this.allPagesOpen.set(false);
        setTimeout(() => {
            this.pages.update(pages =>
                pages.map(p => 
                    p.id === id
                        ? { ...p, flipped: false, reverseFlip: false }
                        : p
                )
            );
        }, 1000);
    }

    viewResume(): void {
        this.resumeService.downloadResume(this.resume)
            .subscribe(pdf => window.open(URL.createObjectURL(pdf)));
    }
}

interface Page {
    id: number;
    reverseFlip?: boolean;
    flipped?: boolean;
    front?: string;
    back?: string;
}
