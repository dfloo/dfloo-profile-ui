import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { SnackBarService } from '@core/services';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(SnackBarService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage :string;

            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
            } else {
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'Bad request';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized access';
                        break;
                    case 403:
                        errorMessage = 'Forbidden';
                        break;
                    case 404:
                        errorMessage = 'Resource not found';
                        break;
                    case 500:
                        errorMessage = 'Internal server error';
                        break;
                    default:
                        errorMessage = error.error?.message
                            || `${error.status}: ${error.statusText}`;
                }
            }

            snackBar.open(errorMessage, 'error');

            return throwError(() => error);
        })
    );
}
