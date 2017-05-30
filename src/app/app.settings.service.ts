import { Injectable } from '@angular/core';

declare var Peer: any;

@Injectable()
export class AppSettingsService {

    private URL: string = 'http://localhost:3000';
    private peer: any;
    private username: string;
    private isLoggedIn: boolean;

    constructor() {
        this.peer = new Peer({
            host: 'localhost',
            port: 9000,
            path: '/peerjs',
            debug: 3,
            config: {
                'iceServers': [
                    { url: 'stun:stun1.l.google.com:19302' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh', username: 'webrtc@live.com'
                    }
                ]
            }
        });
        this.isLoggedIn = false;
    }

    public getURL(): string {
        return this.URL;
    }

    public getPeer(): any {
        return this.peer;
    }

    public getUsername(): string {
        return this.username;
    }

    public getIsLoggedIn(): boolean {
        return this.isLoggedIn;
    }


    public setUsername(username: string): void {
        this.username = username;
    }

    public setIsLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn;
    }
}