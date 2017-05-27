import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app/app.settings.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

const LOCAL_STORAGE_SOCKET = 'StreamAppSocket';

export interface Notification {
    from: string;
    socketid: string;
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

    public emit(socketId: string, message: string): void {
        let socket = io(this.URL + '/' + socketId);
        socket.emit('emit', message);
    }

    public on(socketId: string): Observable<string> {
        return new Observable(observer => {
            let socket = io(this.URL + '/' + socketId);
            socket.on('emit', (data) => {
                observer.next(data);
            });
            return () => {
                socket.disconnect();
            };
        });
    }

    public notify(): Observable<Notification> {
        return new Observable(observer => {
            this.socket = io(this.URL + '/' + this.socketId);
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