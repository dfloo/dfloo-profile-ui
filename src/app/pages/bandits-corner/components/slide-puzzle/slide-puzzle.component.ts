import {
    ChangeDetectionStrategy,
    Component,
    computed,
    OnInit,
    signal,
} from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

// TODO: Replace/add Bandit puzzle images here when provided
const PUZZLE_IMAGES = [
    'assets/profile_pic.jpg',
];

const GRID_OPTIONS = [3, 4, 5, 6];

@Component({
    selector: 'slide-puzzle',
    templateUrl: './slide-puzzle.component.html',
    styleUrl: './slide-puzzle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonToggleModule, MatIconButton, MatIcon, MatButton],
})
export class SlidePuzzleComponent implements OnInit {
    readonly gridOptions = GRID_OPTIONS;
    readonly imageCount = PUZZLE_IMAGES.length;

    gridSize = signal<number>(4);
    imageIndex = signal<number>(0);
    tiles = signal<(number | null)[]>([]);
    moveCount = signal<number>(0);

    isSolved = computed(() => {
        const ts = this.tiles();
        if (!ts.length) return false;
        return ts.every((t, i) =>
            i === ts.length - 1 ? t === null : t === i,
        );
    });

    ngOnInit(): void {
        this.newGame();
    }

    newGame(): void {
        const n = this.gridSize();
        const total = n * n;
        const ordered = [
            ...(Array.from({ length: total - 1 }, (_, i) => i) as (number | null)[]),
            null,
        ];
        this.tiles.set(this.shuffleSolvable(ordered, n));
        this.moveCount.set(0);
    }

    onGridChange(event: MatButtonToggleChange): void {
        this.gridSize.set(event.value as number);
        this.newGame();
    }

    prevImage(): void {
        this.imageIndex.update((i) =>
            (i - 1 + PUZZLE_IMAGES.length) % PUZZLE_IMAGES.length,
        );
        this.newGame();
    }

    nextImage(): void {
        this.imageIndex.update((i) => (i + 1) % PUZZLE_IMAGES.length);
        this.newGame();
    }

    onTileClick(index: number): void {
        if (this.isSolved()) return;

        const ts = this.tiles();
        const blank = ts.indexOf(null);
        const n = this.gridSize();
        const dr = Math.abs(Math.floor(index / n) - Math.floor(blank / n));
        const dc = Math.abs((index % n) - (blank % n));

        if (dr + dc !== 1) return;

        this.tiles.update((prev) => {
            const copy = [...prev];
            [copy[index], copy[blank]] = [copy[blank], copy[index]];
            return copy;
        });
        this.moveCount.update((c) => c + 1);
    }

    getTileStyle(tileId: number): Record<string, string> {
        const n = this.gridSize();
        const row = Math.floor(tileId / n);
        const col = tileId % n;
        const image = PUZZLE_IMAGES[this.imageIndex()];
        return {
            'background-image': `url(${image})`,
            'background-size': `${n * 100}% ${n * 100}%`,
            'background-position': `${(col * 100) / (n - 1)}% ${(row * 100) / (n - 1)}%`,
        };
    }

    private shuffleSolvable(tiles: (number | null)[], n: number): (number | null)[] {
        const arr = [...tiles];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        if (!this.isSolvableState(arr, n)) {
            // Flip parity by swapping the first two non-blank tiles
            const first = arr.findIndex((t) => t !== null);
            const second = arr.findIndex((t, i) => t !== null && i > first);
            [arr[first], arr[second]] = [arr[second], arr[first]];
        }

        return arr;
    }

    private isSolvableState(tiles: (number | null)[], n: number): boolean {
        const flat = tiles.filter((t): t is number => t !== null);
        let inversions = 0;
        for (let i = 0; i < flat.length; i++) {
            for (let j = i + 1; j < flat.length; j++) {
                if (flat[i] > flat[j]) inversions++;
            }
        }

        if (n % 2 !== 0) {
            return inversions % 2 === 0;
        }

        const blankIndex = tiles.indexOf(null);
        const blankRowFromBottom = n - Math.floor(blankIndex / n);
        return (inversions + blankRowFromBottom) % 2 !== 0;
    }
}
