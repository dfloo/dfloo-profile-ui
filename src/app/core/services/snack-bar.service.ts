import { inject, Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackBarService {
    private snackBar = inject(MatSnackBar);
    private defaultConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
    };

    open(
        message: string,
        type: SnackBarType = 'success',
        config?: MatSnackBarConfig,
    ): void {
        this.snackBar.open(message, 'Dismiss', config ?? this.getConfig(type));
    }

    private getConfig(action: SnackBarType): MatSnackBarConfig {
        return {
            ...this.defaultConfig,
            panelClass: [action],
        };
    }
}

export type SnackBarType = 'success' | 'warning' | 'error';
