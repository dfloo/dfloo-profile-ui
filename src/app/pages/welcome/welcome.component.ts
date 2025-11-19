import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    QueryList,
    signal,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ResumeService } from '@api/resume';

import { textSnippets } from './welcome';

@Component({
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule]
})
export class WelcomeComponent implements AfterViewInit {
    @ViewChild('container') container!: ElementRef;
    @ViewChildren('scrollMarker') scrollMarkers!: QueryList<ElementRef>;

    private resumeService = inject(ResumeService);
    private observer?: IntersectionObserver

    scrollMarkerIds = Array.from(
        { length: textSnippets.length + 1 },
        (_, i) => i
    );
    activeIndex = signal(0);
    showSnippets = computed(() => (this.activeIndex() < textSnippets.length));
    currentSnippet = computed(() => {
        const index = this.activeIndex();

        return index < textSnippets.length ? textSnippets[index]: '';
    });

    ngAfterViewInit(): void {
        this.initializeObserver();
    }

    viewResume(): void {
        this.resumeService.downloadDefaultResume()
            .subscribe(pdf => window.open(URL.createObjectURL(pdf)));
    }

    viewSocial(account: 'github' | 'linkedin'): void {
        if (account === 'github') {
            window.open('https://github.com/dfloo');
        } else {
            window.open('https://www.linkedin.com/in/dfloo');
        }
    }

    private initializeObserver(): void {
        const options = {
            root: this.container.nativeElement,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.5
        };
        this.observer = new IntersectionObserver(
            this.observerCallback.bind(this),
            options
        );

        this.scrollMarkers.forEach(({ nativeElement }) => {
            this.observer?.observe(nativeElement);
        });
    }

    private observerCallback(entries: IntersectionObserverEntry[]): void {
        let mostVisible = { ratio: 0, index: -1 };

        entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
            if (!isIntersecting) return;

            const dataId = target.getAttribute('data-id');

            if (!dataId) return;

            const index = parseInt(dataId, 10);

            if (intersectionRatio > mostVisible.ratio) {
                mostVisible = { ratio: intersectionRatio, index }
            }
        });

        const { index } = mostVisible;

        if (index >= 0 && this.activeIndex() !== index) {
            this.activeIndex.set(index);
        }
    }
}
