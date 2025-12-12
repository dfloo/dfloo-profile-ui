import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { SettingsService } from '@api/settings';
import { MaterialTheme } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private settingsService = inject(SettingsService);
    private renderer: Renderer2;
    private document = inject(DOCUMENT);
    private readonly themeLinkId = 'app-theme';

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    loadAndApplyTheme(): void {
        this.settingsService.getSettings().subscribe(({ materialTheme }) => {
            this.applyTheme(materialTheme);
        });
    }

    applyTheme(materialTheme: MaterialTheme): void {
        const newLink = this.renderer.createElement('link');
        this.renderer.setAttribute(newLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(newLink, 'id', this.themeLinkId);
        this.renderer.setAttribute(newLink, 'href', `${materialTheme}.css`);

        const existingLink = this.document.getElementById(this.themeLinkId);
        if (existingLink) {
            newLink.onload = () => {
                this.renderer.removeChild(this.document.head, existingLink);
            };
        }

        this.renderer.appendChild(this.document.head, newLink);
    }
}
