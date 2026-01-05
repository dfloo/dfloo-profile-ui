import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor
} from '@material/material-color-utilities';

import { CustomThemeConfig, FontFamily, SettingsService } from '@api/settings';
import { MaterialTheme, PremadeMaterialTheme } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private settingsService = inject(SettingsService);
    private renderer: Renderer2;
    private document = inject(DOCUMENT);
    private customCssUrl: string | null = null;
    private readonly themeLinkId = 'app-theme';

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    loadAndApplyTheme(): void {
        this.settingsService.getSettings().subscribe(settings => {
            const { materialTheme, customThemeConfig } = settings;
            this.applyTheme(materialTheme, customThemeConfig);
        });
    }

    applyTheme(
        materialTheme: MaterialTheme,
        customThemeConfig?: CustomThemeConfig
    ): void {
        if (materialTheme === MaterialTheme.Custom) {
            this.applyCustomTheme(customThemeConfig);
        } else {
            this.applyPremadeTheme(materialTheme);
        }
    }

    applyPremadeTheme(materialTheme: PremadeMaterialTheme): void {
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

    applyCustomTheme(config?: CustomThemeConfig): void {
        const primaryColor = config?.primary ?? '#005cbb'
        const accentColor = config?.accent ?? '#FFEB3B'
        const theme = themeFromSourceColor(
            argbFromHex(primaryColor),
            [{
                name: 'accent',
                value: argbFromHex(accentColor),
                blend: true
            }]
        );
        const scheme = config?.dark ? theme.schemes.dark : theme.schemes.light;
        const [accent] = theme.customColors;
        const accentScheme = config?.dark ? accent.dark : accent.light
        const fontFamily = config?.fontFamily ?? FontFamily.Roboto;
    
        const vars: Record<string, string> = {
            '--mat-sys-background': hexFromArgb(scheme.background),
            '--mat-sys-error': hexFromArgb(scheme.error),
            '--mat-sys-error-container': hexFromArgb(scheme.errorContainer),
            '--mat-sys-inverse-on-surface': hexFromArgb(scheme.inverseOnSurface),
            '--mat-sys-inverse-primary': hexFromArgb(scheme.inversePrimary),
            '--mat-sys-inverse-surface': hexFromArgb(scheme.inverseSurface),
            '--mat-sys-on-background': hexFromArgb(scheme.onBackground),
            '--mat-sys-on-error': hexFromArgb(scheme.onError),
            '--mat-sys-on-error-container': hexFromArgb(scheme.onErrorContainer),
            '--mat-sys-on-primary': hexFromArgb(scheme.onPrimary),
            '--mat-sys-on-primary-container': hexFromArgb(scheme.onPrimaryContainer),
            '--mat-sys-on-primary-fixed': hexFromArgb(scheme.onPrimaryContainer),//
            '--mat-sys-on-primary-fixed-variant': hexFromArgb(scheme.onPrimary),//
            '--mat-sys-on-secondary': hexFromArgb(scheme.onSecondary),
            '--mat-sys-on-secondary-container': hexFromArgb(scheme.onSecondaryContainer),
            '--mat-sys-on-secondary-fixed': hexFromArgb(scheme.onSecondaryContainer),//
            '--mat-sys-on-secondary-fixed-variant': hexFromArgb(scheme.onSecondary),//
            '--mat-sys-on-surface': hexFromArgb(scheme.onSurface),
            '--mat-sys-on-surface-variant': hexFromArgb(scheme.onSurfaceVariant),
            '--mat-sys-on-tertiary': hexFromArgb(accentScheme.onColor),
            '--mat-sys-on-tertiary-container': hexFromArgb(accentScheme.onColorContainer),
            '--mat-sys-on-tertiary-fixed': hexFromArgb(accentScheme.onColorContainer),//
            '--mat-sys-on-tertiary-fixed-variant': hexFromArgb(accentScheme.onColor),//
            '--mat-sys-outline': hexFromArgb(scheme.outline),
            '--mat-sys-outline-variant': hexFromArgb(scheme.outlineVariant),
            '--mat-sys-primary': hexFromArgb(scheme.primary),
            '--mat-sys-primary-container': hexFromArgb(scheme.primaryContainer),
            '--mat-sys-primary-fixed': hexFromArgb(scheme.primaryContainer),//
            '--mat-sys-primary-fixed-dim': hexFromArgb(scheme.primary),//
            '--mat-sys-scrim': hexFromArgb(scheme.scrim),
            '--mat-sys-secondary': hexFromArgb(scheme.secondary),
            '--mat-sys-secondaryContainer': hexFromArgb(scheme.secondaryContainer),
            '--mat-sys-secondary-fixed': hexFromArgb(scheme.secondaryContainer),//
            '--mat-sys-secondary-fixed-dim': hexFromArgb(scheme.secondary),//
            '--mat-sys-shadow': hexFromArgb(scheme.shadow),
            '--mat-sys-surface': hexFromArgb(scheme.surface),
            '--mat-sys-surface-bright': hexFromArgb(scheme.background),//
            '--mat-sys-surface-container': hexFromArgb(scheme.surfaceVariant),//
            '--mat-sys-surface-container-high': hexFromArgb(scheme.surface),//
            '--mat-sys-surface-container-highest': hexFromArgb(scheme.surface),//
            '--mat-sys-surface-container-low': hexFromArgb(scheme.surface),//
            '--mat-sys-surface-container-lowest': hexFromArgb(scheme.background),//
            '--mat-sys-surface-dim': hexFromArgb(scheme.surfaceVariant),//
            '--mat-sys-surface-tint': hexFromArgb(scheme.primary),//
            '--mat-sys-surface-variant': hexFromArgb(scheme.surfaceVariant),
            '--mat-sys-tertiary': accentColor,
            '--mat-sys-tertiary-container': hexFromArgb(accentScheme.colorContainer),//
            '--mat-sys-tertiary-fixed': hexFromArgb(accentScheme.colorContainer),//
            '--mat-sys-tertiary-fixed-dim': hexFromArgb(accentScheme.color),//
            '--mat-sys-neutral-variant20': hexFromArgb(scheme.surfaceVariant), // or scheme.outlineVariant
            '--mat-sys-neutral10': hexFromArgb(scheme.background),// or scheme.surface
            '--mat-sys-level0': '0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12)',
            '--mat-sys-level1': '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
            '--mat-sys-level2': '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
            '--mat-sys-level3': '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
            '--mat-sys-level4': '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
            '--mat-sys-level5': '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)',
            '--mat-sys-body-large': `400 1rem / 1.5rem ${fontFamily}`,
            '--mat-sys-body-large-font': `${fontFamily}`,
            '--mat-sys-body-large-line-height': '1.5rem',
            '--mat-sys-body-large-size': '1rem',
            '--mat-sys-body-large-tracking': '0.031rem',
            '--mat-sys-body-large-weight': '400',
            '--mat-sys-body-medium': `400 0.875rem / 1.25rem ${fontFamily}`,
            '--mat-sys-body-medium-font': `${fontFamily}`,
            '--mat-sys-body-medium-line-height': '1.25rem',
            '--mat-sys-body-medium-size': '0.875rem',
            '--mat-sys-body-medium-tracking': '0.016rem',
            '--mat-sys-body-medium-weight': '400',
            '--mat-sys-body-small': `400 0.75rem / 1rem ${fontFamily}`,
            '--mat-sys-body-small-font': `${fontFamily}`,
            '--mat-sys-body-small-line-height': '1rem',
            '--mat-sys-body-small-size': '0.75rem',
            '--mat-sys-body-small-tracking': '0.025rem',
            '--mat-sys-body-small-weight': '400',
            '--mat-sys-display-large': `400 3.562rem / 4rem ${fontFamily}`,
            '--mat-sys-display-large-font': `${fontFamily}`,
            '--mat-sys-display-large-line-height': '4rem',
            '--mat-sys-display-large-size': '3.562rem',
            '--mat-sys-display-large-tracking': '-0.016rem',
            '--mat-sys-display-large-weight': '400',
            '--mat-sys-display-medium': `400 2.812rem / 3.25rem ${fontFamily}`,
            '--mat-sys-display-medium-font': `${fontFamily}`,
            '--mat-sys-display-medium-line-height': '3.25rem',
            '--mat-sys-display-medium-size': '2.812rem',
            '--mat-sys-display-medium-tracking': '0',
            '--mat-sys-display-medium-weight': '400',
            '--mat-sys-display-small': `400 2.25rem / 2.75rem ${fontFamily}`,
            '--mat-sys-display-small-font': `${fontFamily}`,
            '--mat-sys-display-small-line-height': '2.75rem',
            '--mat-sys-display-small-size': '2.25rem',
            '--mat-sys-display-small-tracking': '0',
            '--mat-sys-display-small-weight': '400',
            '--mat-sys-headline-large': `400 2rem / 2.5rem ${fontFamily}`,
            '--mat-sys-headline-large-font': `${fontFamily}`,
            '--mat-sys-headline-large-line-height': '2.5rem',
            '--mat-sys-headline-large-size': '2rem',
            '--mat-sys-headline-large-tracking': '0',
            '--mat-sys-headline-large-weight': '400',
            '--mat-sys-headline-medium': `400 1.75rem / 2.25rem ${fontFamily}`,
            '--mat-sys-headline-medium-font': `${fontFamily}`,
            '--mat-sys-headline-medium-line-height': '2.25rem',
            '--mat-sys-headline-medium-size': '1.75rem',
            '--mat-sys-headline-medium-tracking': '0',
            '--mat-sys-headline-medium-weight': '400',
            '--mat-sys-headline-small': `400 1.5rem / 2rem ${fontFamily}`,
            '--mat-sys-headline-small-font': `${fontFamily}`,
            '--mat-sys-headline-small-line-height': '2rem',
            '--mat-sys-headline-small-size': '1.5rem',
            '--mat-sys-headline-small-tracking': '0',
            '--mat-sys-headline-small-weight': '400',
            '--mat-sys-label-large': `500 0.875rem / 1.25rem ${fontFamily}`,
            '--mat-sys-label-large-font': `${fontFamily}`,
            '--mat-sys-label-large-line-height': '1.25rem',
            '--mat-sys-label-large-size': '0.875rem',
            '--mat-sys-label-large-tracking': '0.006rem',
            '--mat-sys-label-large-weight': '500',
            '--mat-sys-label-large-weight-prominent': '700',
            '--mat-sys-label-medium': `500 0.75rem / 1rem ${fontFamily}`,
            '--mat-sys-label-medium-font': `${fontFamily}`,
            '--mat-sys-label-medium-line-height': '1rem',
            '--mat-sys-label-medium-size': '0.75rem',
            '--mat-sys-label-medium-tracking': '0.031rem',
            '--mat-sys-label-medium-weight': '500',
            '--mat-sys-label-medium-weight-prominent': '700',
            '--mat-sys-label-small': `500 0.688rem / 1rem ${fontFamily}`,
            '--mat-sys-label-small-font': `${fontFamily}`,
            '--mat-sys-label-small-line-height': '1rem',
            '--mat-sys-label-small-size': '0.688rem',
            '--mat-sys-label-small-tracking': '0.031rem',
            '--mat-sys-label-small-weight': '500',
            '--mat-sys-title-large': `400 1.375rem / 1.75rem ${fontFamily}`,
            '--mat-sys-title-large-font': `${fontFamily}`,
            '--mat-sys-title-large-line-height': '1.75rem',
            '--mat-sys-title-large-size': '1.375rem',
            '--mat-sys-title-large-tracking': '0',
            '--mat-sys-title-large-weight': '400',
            '--mat-sys-title-medium': `500 1rem / 1.5rem ${fontFamily}`,
            '--mat-sys-title-medium-font': `${fontFamily}`,
            '--mat-sys-title-medium-line-height': '1.5rem',
            '--mat-sys-title-medium-size': '1rem',
            '--mat-sys-title-medium-tracking': '0.009rem',
            '--mat-sys-title-medium-weight': '500',
            '--mat-sys-title-small': `500 0.875rem / 1.25rem ${fontFamily}`,
            '--mat-sys-title-small-font': `${fontFamily}`,
            '--mat-sys-title-small-line-height': '1.25rem',
            '--mat-sys-title-small-size': '0.875rem',
            '--mat-sys-title-small-tracking': '0.006rem',
            '--mat-sys-title-small-weight': '500',
            '--mat-sys-corner-extra-large': '28px',
            '--mat-sys-corner-extra-large-top': '28px 28px 0 0',
            '--mat-sys-corner-extra-small': '4px',
            '--mat-sys-corner-extra-small-top': '4px 4px 0 0',
            '--mat-sys-corner-full': '9999px',
            '--mat-sys-corner-large': '16px',
            '--mat-sys-corner-large-end': '0 16px 16px 0',
            '--mat-sys-corner-large-start': '16px 0 0 16px',
            '--mat-sys-corner-large-top': '16px 16px 0 0',
            '--mat-sys-corner-medium': '12px',
            '--mat-sys-corner-none': '0',
            '--mat-sys-corner-small': '8px',
            '--mat-sys-dragged-state-layer-opacity': '0.16',
            '--mat-sys-focus-state-layer-opacity': '0.12',
            '--mat-sys-hover-state-layer-opacity': '0.08',
            '--mat-sys-pressed-state-layer-opacity': '0.12'
        }

        const cssText = `:root {\n${Object.entries(vars).map(
            ([k, v]) => `  ${k}: ${v};`
        ).join('\n')}\n}`;
        const blob = new Blob([cssText], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const newLink = this.renderer.createElement('link');
        this.renderer.setAttribute(newLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(newLink, 'id', this.themeLinkId);
        this.renderer.setAttribute(newLink, 'href', url);

        const existingLink = this.document.getElementById(this.themeLinkId);

        if (existingLink) {
            newLink.onload = () => {
                this.renderer.removeChild(this.document.head, existingLink);
                if (this.customCssUrl) {
                    URL.revokeObjectURL(this.customCssUrl);
                    this.customCssUrl = null;
                }
            };
        } else {
            if (this.customCssUrl) {
                URL.revokeObjectURL(this.customCssUrl);
                this.customCssUrl = null;
            }
        }

        this.customCssUrl = url;
        this.renderer.appendChild(this.document.head, newLink);
    }
}
