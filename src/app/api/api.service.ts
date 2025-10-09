import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private host = 'http://localhost:8080';
    private http = inject(HttpClient);

    get<T>(path: string): Observable<T> {
        return this.http.get<T>(this.getURL(path));
    }

    download<Blob>(path: string, body?: unknown): Observable<Blob> {
        return this.http.post<Blob>(
            this.getURL(path),
            body,
            { responseType: 'blob' as 'json' }
        )
    }

    post<T>(path: string, body: unknown): Observable<T> {
        return this.http.post<T>(this.getURL(path), body);
    }

    put<T>(path: string, body: unknown): Observable<T> {
        return this.http.put<T>(this.getURL(path), body);
    }

    delete<T>(path: string, body: unknown): Observable<T> {
        return this.http.delete<T>(this.getURL(path), { body });
    }

    private getURL(path: string): string {
        return `${this.host}/api/${path}`;
    }
}
