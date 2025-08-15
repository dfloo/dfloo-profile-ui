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
        return this.http.get<T>(`${this.host}/api/${path}`);
    }

    post<T>(path: string, body: T): Observable<object> {
        return this.http.post(`${this.host}/api/${path}`, body)
    }

    put<T>(path: string, body: T): Observable<object> {
        return this.http.put(`${this.host}/api/${path}`, body)
    }
}