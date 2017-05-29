import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

export interface Notification {
    from: string;
    peerid: string;
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
            this.socket.emit('users');

            this.socket.on('users', (data) => {
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
    public call(callee: string): void {
        this.socket.emit('call', this.appSettingsService.username, callee);
    }

    /**
     * Notify each time you receive a call from server
     */
    public subscribe(): Observable<Notification> {
        return new Observable(observer => {
            this.socket.on('notify', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    /**
     * Connect with username and peer id
     * @param username 
     */
    public login(username: string): Observable<any> {
        return new Observable(observer => {
            let peerid = this.appSettingsService.peer.id;
            this.socket.emit('login', username, peerid);

            this.socket.on('login', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

}