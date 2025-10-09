import { Injectable } from '@angular/core';

import { Resume } from '@models/resume';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    private key = 'dflooData';

    getData(): SessionStorageData {
        const data = sessionStorage.getItem(this.key);

        return data ? JSON.parse(data) : {};
    }

    setData(data: SessionStorageData): void {
        sessionStorage.setItem(
            this.key,
            JSON.stringify({ ...this.getData(), ...data })
        )
    }
}

interface SessionStorageData {
    resumes?: Resume[]
}
