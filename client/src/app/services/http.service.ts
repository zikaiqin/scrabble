import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

const basePath = `${environment.serverUrl}/api`;

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    getExample() {
        return this.http.get(`${basePath}/example`, { responseType: 'json' });
    }
}
