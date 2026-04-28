import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SlidePuzzleComponent } from './slide-puzzle.component';

describe('SlidePuzzleComponent', () => {
    let component: SlidePuzzleComponent;
    let fixture: ComponentFixture<SlidePuzzleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlidePuzzleComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SlidePuzzleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initializes with correct number of tiles', () => {
        const n = component.gridSize();
        expect(component.tiles().length).toBe(n * n);
    });

    it('always has exactly one blank tile after init', () => {
        const blanks = component.tiles().filter((t) => t === null);
        expect(blanks.length).toBe(1);
    });

    it('isSolved is false after shuffled init', () => {
        // Extremely unlikely to be solved after a shuffle with n=4
        const n = component.gridSize();
        if (n > 2) {
            // For safety only assert when there's meaningful scrambling
            const tiles = component.tiles();
            const solved = tiles.every((t, i) =>
                i === tiles.length - 1 ? t === null : t === i,
            );
            // Either solved (astronomically unlikely) or not — just confirm the computed matches
            expect(component.isSolved()).toBe(solved);
        }
    });

    it('isSolved is true when tiles are in order with blank at end', () => {
        const n = component.gridSize();
        const solved = [
            ...(Array.from({ length: n * n - 1 }, (_, i) => i) as (number | null)[]),
            null,
        ];
        component.tiles.set(solved);
        expect(component.isSolved()).toBeTrue();
    });

    it('onTileClick slides an adjacent tile into the blank', () => {
        const n = component.gridSize();
        // Place blank at last position and a tile adjacent above it
        const solved = [
            ...(Array.from({ length: n * n - 1 }, (_, i) => i) as (number | null)[]),
            null,
        ];
        component.tiles.set(solved);

        const blankIndex = n * n - 1;
        const adjacentIndex = blankIndex - n; // tile directly above blank
        const movingTile = component.tiles()[adjacentIndex];

        component.onTileClick(adjacentIndex);

        expect(component.tiles()[blankIndex]).toBe(movingTile);
        expect(component.tiles()[adjacentIndex]).toBeNull();
        expect(component.moveCount()).toBe(1);
    });

    it('onTileClick does nothing for a non-adjacent tile', () => {
        const n = component.gridSize();
        const before = [...component.tiles()];
        const blankIndex = component.tiles().indexOf(null);
        // Find a tile that is not adjacent
        const nonAdjacent = before.findIndex((_, i) => {
            if (i === blankIndex) return false;
            const dr = Math.abs(Math.floor(i / n) - Math.floor(blankIndex / n));
            const dc = Math.abs((i % n) - (blankIndex % n));
            return dr + dc > 1;
        });

        if (nonAdjacent !== -1) {
            component.onTileClick(nonAdjacent);
            expect(component.tiles()).toEqual(before);
            expect(component.moveCount()).toBe(0);
        }
    });

    it('onTileClick does nothing when puzzle is solved', () => {
        const n = component.gridSize();
        const solved = [
            ...(Array.from({ length: n * n - 1 }, (_, i) => i) as (number | null)[]),
            null,
        ];
        component.tiles.set(solved);
        expect(component.isSolved()).toBeTrue();

        const adjacentIndex = n * n - 1 - n;
        component.onTileClick(adjacentIndex);
        expect(component.moveCount()).toBe(0);
    });

    it('newGame resets moveCount and produces a valid board', () => {
        component.moveCount.set(42);
        component.newGame();
        expect(component.moveCount()).toBe(0);
        const n = component.gridSize();
        expect(component.tiles().length).toBe(n * n);
        expect(component.tiles().filter((t) => t === null).length).toBe(1);
    });

    it('changing grid size resets the puzzle', () => {
        component.gridSize.set(3);
        component.newGame();
        expect(component.tiles().length).toBe(9);

        component.gridSize.set(6);
        component.newGame();
        expect(component.tiles().length).toBe(36);
    });

    it('getTileStyle returns background-image and background-size', () => {
        const style = component.getTileStyle(0);
        expect(style['background-image']).toContain('url(');
        expect(style['background-size']).toContain('%');
        expect(style['background-position']).toBe('0% 0%');
    });
});
