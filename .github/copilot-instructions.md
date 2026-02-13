# Copilot Instructions for dfloo-profile-ui

## Project Overview

This is an Angular 20 application for a personal portfolio and job search tools, featuring resume building, job application tracking, and interactive storytelling components.

## Core Technologies & Patterns

- **Framework**: Angular 20 with standalone components
- **UI Libraries**: Angular Material, Angular CDK (drag-drop)
- **Forms**: Formly with Material integration
- **State Management**: Signals and computed values
- **Authentication**: Auth0
- **Testing**: Jasmine with Karma
- **Build**: Angular CLI with Docker deployment

## Code Style & Conventions

### Component Architecture

- Use standalone components exclusively
- Implement `ChangeDetectionStrategy.OnPush` for all components
- Follow the pattern: `selector: 'kebab-case'`
- Place business logic in services, keep components focused on presentation
- Use signals for reactive state management

### File Organization

```
src/app/
├── api/         # API services (resume, profile, job-application)
├── components/  # Shared components (app-header, profile-form, etc.)
├── core/        # Core utilities (services, guards, interceptors, form-fields)
├── models/      # Data models with normalize/serialize methods
├── pages/       # Feature pages with child components
└── styles/      # Global styles and helpers
```

### Service Patterns

- Use `inject()` function for dependency injection
- Provide services at root level: `@Injectable({ providedIn: 'root' })`
- Handle authentication branching in services (local vs authenticated API calls)
- Use RxJS operators: `switchMap`, `map`, `filter` for stream transformations
- Pattern for API services:
    ```typescript
    return this.auth.isAuthenticated$.pipe(
        switchMap((isAuthenticated) => {
            if (!isAuthenticated) {
                return this.handleLocalOperation();
            }
            return this.apiService.method(...);
        })
    );
    ```

### Model Patterns

- Extend BaseModel for all data models
- Implement static normalize(DTO): Model method for API response transformation
- Implement static serialize(Model): DTO method for API request transformation
- Include optional getMockDTO() for testing
- Example: Resume, Profile

### Form Handling

- Use Formly for dynamic form generation
- Create dedicated \*FormFieldsService for each form (e.g., ResumeFormFieldsService)
- Leverage custom Formly types: repeat-section, color-picker, toggle
- Use Material Design form components
- Apply d-flex and flex-grow utility classes for layout

### Drag & Drop

- Use Angular CDK drag-drop: CdkDrag, CdkDropList, CdkDragHandle
- Implement moveItemInArray for reordering
- Update sort indices after drag operations
- Example implementations: ResumeEditorComponent, ApplicationTrackerComponent

### State Management

- Use signals for reactive state: signal(), computed()
- Use effect() for side effects based on signal changes
- Clone with cloneDeep() from lodash-es before mutations
- Compare state with isEqual() from lodash-es
- Pattern for tracking changes:
    ```typescript
    private snapshot = cloneDeep(this.data());
    get hasChanged(): boolean {
        return !isEqual(this.data(), this.snapshot);
    }
    ```

### Styling

- Use SCSS with @use '@variables' as \* for imports
- Define component-specific styles in .component.scss
- Use Material Design theming system
- Apply utility classes from helpers.scss
- Fixed heights: Use $app-header-height and $app-content-height variables

### Testing

- Write Jasmine specs for all services and components
- Use jasmine.createSpyObj for mocking dependencies
- Test both authenticated and unauthenticated flows
- Structure: describe blocks for services/methods, it blocks for test cases
- Example: ResumeService.spec, ProfileService.spec

## Component Patterns

### Feature Components

- Accept inputs with input<T>() or model<T>()
- Emit events with output<T>()
- Use @ViewChildren for accessing child components
- Implement OnInit for initialization logic
- Use effect() for reactive side effects

### Material Components

- Prefer Material buttons: matButton="filled", matButton="outlined", matIconButton
- Use MatExpansionPanel for collapsible sections
- Use MatDialog for modals
- Use MatTooltip for hover hints
- Pattern for expansion panels with drag handles:
    ```html
    <mat-expansion-panel>
        <mat-expansion-panel-header>
            <mat-icon cdkDragHandle matTooltip="Drag">drag_handle</mat-icon>
            <span>{{ title }}</span>
        </mat-expansion-panel-header>
    </mat-expansion-panel>
    ```

### Custom Form Components

- Extend FieldArrayType for repeatable sections
- Implement expand modes: 'all', 'each', or none
- Support drag-and-drop reordering
- Auto-expand last panel on add: use setTimeout with expansionPanels.last.expanded = true
- Example: RepeatSectionComponent

## API Integration

### Service Structure

- Base path: environment.api.serverUrl + '/api/' + path
- Use ApiService for HTTP operations
- Methods: get<T>, post<T>, put<T>, delete<T>, download<Blob>
- Handle auth with Auth0 interceptor (configured in app.config.ts)

### Local Storage Fallback

- Use LocalStorageService for unauthenticated users
- Pattern: check isAuthenticated$ then branch to local or API operations
- Store data with keys: resumes, settings, etc.

## Routing

- Lazy-load feature modules with loadComponent
- Define sidenav routes separately in sidenavRoutes
- Set page titles: title: 'Page Title'
- Child routes for feature sections (e.g., job-search has resume-builder and application-tracker)

## Environment Configuration

- Use set-env.ts script to generate environment files
- Configure Auth0 settings
- Set API server URL
- Pattern: npm run build:prod runs set-env before build

## Docker

- Multi-stage build: builder (Node) → runner (nginx)
- Pass environment variables as build args
- Expose port 8080
- Config: Dockerfile, nginx.conf, compose.yaml

## Best Practices

### DO

- Use fully qualified imports with path aliases: @api, @components, @core, @models, @pages
- Add `// ...existing code...` comments in code suggestions to show context
- Provide file paths in code blocks: `// filepath: path/to/file.ts`
- Keep components focused and under 300 lines
- Extract reusable logic into services
- Use Material Design principles
- Write unit tests for new services
- Handle loading and error states
- Use descriptive variable names
- Add comments for complex logic

### DON'T

- Mutate signals directly (use update() or set())
- Use any type (prefer explicit types or generics)
- Create global state without services
- Skip authentication checks in services
- Forget to unsubscribe (use takeUntilDestroyed() or async pipe)
- Mix template-driven and reactive forms
- Hard-code strings (use enums or constants)
- Nest components more than 3 levels deep
- Create large monolithic components

## Key Files to Reference

- **Models**: Resume, Profile, JobApplication
- **Services**: ResumeService, ProfileService, ThemeService
- **Components**: ResumeEditorComponent, ApplicationTrackerComponent
- **Config**: app.config.ts, app.routes.ts

## Common Operations

### Adding a New Model

1. Create class extending BaseModel
2. Define interface for DTO
3. Implement normalize() and serialize() static methods
4. Create mock data if needed
5. Export from index.ts

### Adding a New Service

1. Create service with @Injectable({ providedIn: 'root' })
2. Inject dependencies with inject()
3. Handle authentication branching
4. Use ApiService for HTTP calls
5. Transform DTOs with model methods
6. Export from index.ts

### Adding a New Page

1. Create component directory under pages/
2. Implement standalone component with OnPush strategy
3. Add route in app.routes.ts with lazy loading
4. Create child components in components/ subdirectory
5. Export from index.ts

### Adding a Formly Form

1. Create \*FormFieldsService provider
2. Define getFields() method returning FormlyFieldConfig[]
3. Use Material field types or custom types
4. Apply layout classes: d-flex, flex-grow, fieldGroupClassName
5. Bind to model with Formly form component

## Additional Context

- This is a personal portfolio showcasing software engineering skills
- Features include resume building, job application tracking, and interactive storytelling
- Target audience: recruiters and hiring managers
- Deployment: Docker container on cloud platform
- License: MIT (see LICENSE)
