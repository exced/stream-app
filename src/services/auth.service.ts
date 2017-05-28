import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map'

const LOCAL_STORAGE_TOKEN = 'StreamAppToken';

@Injectable()
export class AuthService {

    private token: string;
    private URL: string;

    constructor(
        private http: Http,
        private appSettingsService: AppSettingsService
    ) {
        this.URL = appSettingsService.URL;
        // set token if saved in local storage
        //DEBUG this.token = this.getToken();
    }

    public getToken(): string {
        //DEBUG return localStorage.getItem(LOCAL_STORAGE_TOKEN);
        return this.token;
    }

    private setToken(token: string) {
        this.token = token;
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
    }

    private headers(): Headers {
        var headers = new Headers();
        if (this.token) {
            headers.append('Authorization', 'Bearer ' + this.token);
        }
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    public login(username: string, password: string): Observable<boolean> {
        var creds = "username=" + username + "&password=" + password;
        return this.http.post(this.URL + '/login', creds, { headers: this.headers() })
            .map((response: Response) => {
                let res = response.json();
                let token = res && res.token;
                if (token) {
                    this.setToken(token);
                    return true;
                } else {
                    return false;
                }
            });
    }

    public signin(username: string, password: string): Observable<boolean> {
        var creds = "username=" + username + "&password=" + password;
        return this.http.post(this.URL + '/signin', creds, { headers: this.headers() })
            .map((response: Response) => {
                let res = response.json();
                let token = res && res.token;
                if (token) {
                    this.setToken(token);
                    return true;
                } else {
                    return false;
                }
            });
    }

    public logout(): void {
        this.setToken(null);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    }  

}