import { Injectable } from '@angular/core';
import { NAMES } from './color-names';

/**
 * Color name matching based on “Name that Color JavaScript (ntc.js)”.
 *
 * Original work:
 *   Created by Chirag Mehta — http://chir.ag/projects/ntc
 *   License: Creative Commons Attribution 2.5
 *   http://creativecommons.org/licenses/by/2.5/
 *
 * This is a TypeScript rewrite of the core algorithm:
 * - Normalize hex input (#RGB, #RRGGBB, RGB, RRGGBB)
 * - Exact match first
 * - Otherwise pick closest match using weighted distance in RGB + HSL space
 *   ndf = (RGB distance) + 2*(HSL distance)
 */

@Injectable()
export class ColorNameService {
    private initialized = false;
    private exactByHex = new Map<string, string>()
    private entries: {
        hex: string;
        name: string;
        r: number; g: number; b: number;
        h: number; s: number; l: number;
    }[] = [];

    getName(color: string): string {
        const normalized = this.normalizeHex(color);
        if (!normalized) return '';

        this.ensureInit();

        const exact = this.exactByHex.get(normalized);
        if (exact) return exact;

        const [r, g, b] = this.rgb(normalized);
        const [h, s, l] = this.hsl(normalized);

        let bestIdx = -1;
        let bestDf = -1;

        for (let i = 0; i < this.entries.length; i++) {
            const e = this.entries[i];

            const ndf1 =
                Math.pow(r - e.r, 2) +
                Math.pow(g - e.g, 2) +
                Math.pow(b - e.b, 2);

            const ndf2 =
                Math.pow(h - e.h, 2) +
                Math.pow(s - e.s, 2) +
                Math.pow(l - e.l, 2);

            const ndf = ndf1 + ndf2 * 2;

            if (bestDf < 0 || ndf < bestDf) {
                bestDf = ndf;
                bestIdx = i;
            }
        }

        return bestIdx < 0 ? '' : this.entries[bestIdx].name;
    }

    private ensureInit(): void {
        if (this.initialized) return;

        this.entries = NAMES.map(([hex, name]) => {
            const full = `#${hex.toUpperCase()}`;
            const [r, g, b] = this.rgb(full);
            const [h, s, l] = this.hsl(full);
            return { hex: full, name, r, g, b, h, s, l };
        });

        for (const e of this.entries) {
            this.exactByHex.set(e.hex, e.name);
        }

        this.initialized = true;
    }

    /**
     * Accepts: '#RGB', '#RRGGBB', 'RGB', 'RRGGBB'
     * Returns: '#RRGGBB' (uppercase) or null if invalid.
     */
    private normalizeHex(input: string): string | null {
        if (!input) return null;

        let c = input.trim().toUpperCase();
        if (!c) return null;

        if (c[0] !== '#') c = `#${c}`;

        // '#RGB' -> '#RRGGBB'
        if (c.length === 4) {
            const r = c[1];
            const g = c[2];
            const b = c[3];
            c = `#${r}${r}${g}${g}${b}${b}`;
        }

        // must be '#RRGGBB'
        if (c.length !== 7) return null;

        // validate hex chars
        for (let i = 1; i < 7; i++) {
            const ch = c.charCodeAt(i);
            const isDigit = ch >= 48 && ch <= 57; // 0-9
            const isAF = ch >= 65 && ch <= 70; // A-F
            if (!isDigit && !isAF) return null;
        }

        return c;
    }

    // adopted from: Farbtastic 1.2 — http://acko.net/dev/farbtastic
    private rgb(color: string): [number, number, number] {
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        return [r, g, b];
    }

    // adopted from: Farbtastic 1.2 — http://acko.net/dev/farbtastic
    private hsl(color: string): [number, number, number] {
        const r = parseInt(color.substring(1, 3), 16) / 255;
        const g = parseInt(color.substring(3, 5), 16) / 255;
        const b = parseInt(color.substring(5, 7), 16) / 255;

        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;

        let h = 0;
        const l = (min + max) / 2;

        let s = 0;
        if (l > 0 && l < 1) {
            s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
        }

        if (delta > 0) {
            if (max === r && max !== g) h += (g - b) / delta;
            if (max === g && max !== b) h += 2 + (b - r) / delta;
            if (max === b && max !== r) h += 4 + (r - g) / delta;
            h /= 6;
        }

        // match ntc.js behavior (scale to 0..255)
        return [Math.trunc(h * 255), Math.trunc(s * 255), Math.trunc(l * 255)];
    }
}
