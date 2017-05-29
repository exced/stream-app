import { Injectable } from '@angular/core';

declare var Peer: any;

@Injectable()
export class AppSettingsService {

    URL: string = 'http://localhost:3000';
    peer: any;
    username: string;

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
    }

    public setUsername(username: string): void {
        this.username = username;
    }
}