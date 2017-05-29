import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Notification } from '../../services/socket.service';
import { ConfirmService } from '../../services/confirm.service';
import { Confirm } from '../../services/confirm.service';
import { AppSettingsService } from '../app.settings.service';

declare var Peer: any;

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

    @ViewChild('remoteVideo') remoteVideoRef: any;
    @ViewChild('localVideo') localVideoRef: any;

    confirm: Confirm;
    socketid: string;
    peer: any;
    remotePeerid: any;
    userid: string = '';

    constructor(
        private appSettingsService: AppSettingsService,
        private socketService: SocketService,
        private route: ActivatedRoute,
        private confirmService: ConfirmService,
    ) {
        // local peer
        this.peer = appSettingsService.peer;
        // call confirm subscription
        confirmService.getConfirm().subscribe(confirm => {
            this.confirm = confirm;
        });
    }

    ngOnInit() {
        // route peerid subscription
        this.route.params
            .subscribe((params) => {
                this.userid = params['userid'];
                // call answer
                if (this.confirm.confirmed) {
                    this.remotePeerid = this.confirm.peerid;
                    this.receive();
                }
            });
    }

    receive() {
        let video = this.remoteVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            let call = self.peer.call(self.remotePeerid, stream);
            call.on('stream', function (remotestream) {
                video.srcObject = remotestream;
                video.play();
            })
        })
    }

    connect() {
        let conn = this.peer.connect(this.remotePeerid);
        conn.on('open', function () {
            conn.send('Message from that id');
        });
    }

    call() {
        this.socketService.call(this.userid);
        let video = this.localVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        this.peer.on('call', function (call) {
            n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
                call.answer(stream);
                call.on('stream', function (remotestream) {
                    video.srcObject = remotestream;
                    video.play();
                })
            })
        })
    }

    stop() {

    }

}
