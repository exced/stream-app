import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import * as Socketiop2p from 'socket.io-p2p';

export interface Notification {
    from: string;
    socketid: string;
}

@Injectable()
export class SocketService {

    private URL: string;
    private socket: any;

    constructor(private appSettingsService: AppSettingsService) {
        this.URL = appSettingsService.URL;
        this.socket = io(this.URL);
    }

    /**
     * Get current users
     */
    public users(token: string): Observable<[string]> {
        return new Observable(observer => {
            this.socket.emit('users', token);

            this.socket.on('users', (data) => {
                console.log('USERS ');
                console.log(data);
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
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
    public call(token: string, contactname: string): Observable<Notification> {
        return new Observable(observer => {
            this.socket.emit('call', token, contactname);

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
    public subscribe(token: string): Observable<Notification> {
        console.log('subscribe ', token);
        return new Observable(observer => {
            this.socket.emit('subscribe', token);

            this.socket.on('call', (data) => {
                console.log('SUBSCRIBE CALL ');
                console.log(data);
                let notification = <Notification>JSON.parse(data);
                observer.next(notification);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    public send(socketid: string, data: any): void {
        this.socket.emit('send', socketid, data);
    }

    public receive(socketid: string): Observable<any> {
        return new Observable(observer => {
            this.socket.on('receive', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

}