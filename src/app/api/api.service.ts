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

    download(path: string): Observable<Blob> {
        return this.http.get(this.getURL(path), { responseType: 'blob' });
    }

    post<T>(path: string, body: unknown): Observable<T> {
        return this.http.post<T>(this.getURL(path), body)
    }

    put<T>(path: string, body: unknown): Observable<T> {
        return this.http.put<T>(this.getURL(path), body)
    }

    delete(path: string, body: unknown): Observable<object> {
        return this.http.delete(path, { body });
    }

    private getURL(path: string): string {
        return `${this.host}/api${path}`
    } 
}