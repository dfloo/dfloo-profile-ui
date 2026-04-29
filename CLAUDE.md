# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Generate environment.ts from .env, then ng serve (http://localhost:4200)
ng serve            # Dev server only (skips env generation — use if .env already applied)
ng build            # Dev build
npm run build:prod  # Generate environment.ts then build for production
npm test            # Run Karma/Jasmine tests with Chrome (watch mode)
npm run test-ci     # Run tests headlessly — use this in CI or to run all tests once
```

To run a single spec file:
```bash
ng test --include='src/app/path/to/foo.spec.ts'
```

Linting uses ESLint (`eslint.config.mjs`). There is no dedicated lint npm script; run via `npx eslint .`.

## Environment setup

`src/environments/environment.ts` is **generated** — never edit it directly. It is written at startup by `set-env.ts` which reads from `.env`. Running `npm start` or `npm run env` regenerates it. The `.env` file must define: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE`, `AUTH0_CALLBACK_URL`, `API_SERVER_URL`.

In development the backend API is expected at `http://localhost:8080`.

## Architecture

### Technology stack
- **Angular 20** with standalone components and signals (`signal`, `computed`)
- **Angular Material + CDK** for UI components
- **ngx-formly** for dynamic form generation — forms in the app are defined as field config arrays, not hand-crafted templates
- **Auth0** (`@auth0/auth0-angular`) for authentication; JWT is automatically attached to whitelisted API endpoints via `authHttpInterceptorFn`

### Path aliases (tsconfig.json)
```
@pages/*      → src/app/pages/*
@components/* → src/app/components/*
@models/*     → src/app/models/*
@api/*        → src/app/api/*
@core/*       → src/app/core/*
```

### Module layout
- `src/app/api/` — API services (`ProfileService`, `ResumeService`, `JobApplicationService`). All calls go through `ApiService` which prepends `{serverUrl}/api/` to every path.
- `src/app/components/` — Shared components used across pages (app-header, profile-form, settings-form, user-modal, message-dialog).
- `src/app/core/` — Framework-level utilities:
  - `form-fields/` — Custom ngx-formly field types (`repeat-section`, `color-picker`) registered in `appConfig`
  - `interceptors/` — `errorInterceptorFn` catches HTTP errors and shows a snackbar
  - `services/` — `ThemeService`, `UserService` (Auth0 wrapper), `LocalStorageService`, `SnackBarService`
  - `models/` — `MaterialTheme` enum and theme types
- `src/app/models/` — Domain models (`Resume`, `Profile`, `JobApplication`) with static `normalize(dto)` and `serialize(model)` methods for DTO conversion.
- `src/app/pages/` — Route-level components:
  - `welcome/` — Landing page
  - `job-search/` — Parent shell with child routes: `resume-builder`, `application-tracker`, `system-design`
  - `bandits-corner/` — Multi-feature page for Bandit content; dropdown in the top-left selects the active feature (flip book or slide puzzle)

### Theme system
`ThemeService` applies themes in two modes:
- **Premade**: loads a pre-built `{themeName}.css` file into `<head>`
- **Custom**: generates CSS variable overrides via `@material/material-color-utilities` from a primary/accent hex color pair, then injects as a Blob URL

Settings (selected theme, custom colors, font family) persist in `localStorage` via `SettingsService` + `LocalStorageService`. No backend is involved for settings.

### System design whiteboard
`SystemDesignComponent` is a canvas built with CDK Drag-Drop and SVG edges. Nodes extend `BaseSystemNode` which computes anchor points for edge connections. The factory pattern (`system-node.factory.ts`) creates typed node instances (`ClientSystemNode`, `ServerSystemNode`, `DatabaseSystemNode`).

### Authentication
`UserService` wraps Auth0's `AuthService`. Role checks use a custom claim at namespace `http://dfloo-profile.com/roles`. The `Super User` role gates admin-only features (e.g., editing the profile visible to visitors).
