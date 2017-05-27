import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Notification } from '../../services/socket.service';

declare var SimplePeer: any;

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

    @ViewChild('video') videoRef: any;

    contactname: string;
    targetpeer: any;
    peer: any;

    constructor(private socketService: SocketService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        // route contactid subscription
        this.route.params
            .subscribe((params) => {
                this.contactname = params['userid'];
            });
    }

    call() {
        // server subscription to receive valid id to stream
        this.socketService.call(this.contactname).subscribe((notification: Notification) => {
            this.play(notification.socketid);
        })
    }

    play(socketid: string) {
        // video streaming
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        let peerx: any;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            peerx = new SimplePeer({
                initiator: socketid,
                trickle: false,
                stream: stream
            })
            peerx.on('signal', function (data) {
                console.log(JSON.stringify(data));

                this.targetpeer = data;
            })

            peerx.on('data', function (data) {
                console.log('Recieved message:' + data);
            })

            peerx.on('stream', function (stream) {
                video.src = URL.createObjectURL(stream);
                video.play();
            })

        }, function (err) {
            console.log('Failed to get stream', err);
        });

        setTimeout(() => {
            this.peer = peerx;
            console.log(this.peer);
        }, 5000);
    }

    stop() {
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        n.mediaDevices.stop();
    }

}
