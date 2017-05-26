import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

const LOCAL_STORAGE_SOCKET = 'StreamAppSocket';

export interface Notification {
    from: string;
    onAddress: string;
}

@Injectable()
export class SocketService {

    private socket: any;
    private socketId: string;
    private URL: string;
    private username: any;

    constructor(private appSettingsService: AppSettingsService) {
        this.URL = appSettingsService.URL;
    }

    public setSocketId(socketId: string) {
        this.socketId = socketId;
        localStorage.setItem(LOCAL_STORAGE_SOCKET, socketId);
    }

    public emit(message: string): void {
        this.socket.emit('emit', message);
    }

    public accept(notification: Notification): Observable<string> {
        this.socket.emit('accept', notification);
        return new Observable(observer => {
            this.socket = io(this.URL + '/' + notification.onAddress);
            this.socket.on('emit', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

    public notify(username: string): Observable<string> {
        this.socket.emit('notify', username);
        return new Observable(observer => {
            this.socket = io(this.URL + '/' + this.socketId);
            this.socket.on('emit', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }    

    public onNotify(): Observable<Notification> {
        return new Observable(observer => {
            this.socket = io(this.URL + '/' + this.socketId);
            this.socket.on('notify', (data) => {
                let notification = <Notification>data;
                observer.next(notification);
            });
            return () => {
                this.socket.disconnect();
            };
        })
    }

}