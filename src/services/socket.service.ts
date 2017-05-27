import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

export interface Notification {
    from: string;
    socketid: string;
}

@Injectable()
export class SocketService {

    private URL: string;
    private socket: any;
    private token: string;

    constructor(private appSettingsService: AppSettingsService, private authService: AuthService) {
        this.URL = appSettingsService.URL;
        this.socket = io(this.URL);
        this.token = this.authService.getToken();
    }

    ngOnInit() {
        
    }

    /**
     * User join event
     */
    public join(): Observable<string> {
        return new Observable(observer => {
            this.socket.on('join', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    /**
    * User leave event
    */
    public leave(): Observable<string> {
        return new Observable(observer => {
            this.socket.on('leave', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    /**
     * Send a call to a contact
     * @param contactname 
     */
    public call(contactname: string): Observable<Notification> {
        return new Observable(observer => {
            this.socket.emit('call', this.token, contactname);

            this.socket.on('notify', (data) => {
                let notification = <Notification>JSON.parse(data);
                observer.next(notification);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    /**
     * Notify each time you receive a call from server
     */
    public subscribe(): Observable<Notification> {
        console.log('subscribe ', this.token);
        return new Observable(observer => {
            this.socket.emit('subscribe', this.token);

            this.socket.on('notify', (data) => {
                let notification = <Notification>JSON.parse(data);
                observer.next(notification);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

}