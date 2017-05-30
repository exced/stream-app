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

    private confirm: Confirm;
    private socketid: string;
    private peer: any;
    private remotePeerid: any;
    private userid: string = '';

    constructor(
        private appSettingsService: AppSettingsService,
        private socketService: SocketService,
        private route: ActivatedRoute,
        private confirmService: ConfirmService,
    ) {
        // local peer
        this.peer = appSettingsService.getPeer();
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
        let remoteVideo = this.remoteVideoRef.nativeElement;
        let localVideo = this.localVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            localVideo.srcObject = stream;
            localVideo.play();
            let call = self.peer.call(self.remotePeerid, stream);
            call.on('stream', function (remotestream) {
                remoteVideo.srcObject = remotestream;
                remoteVideo.play();
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
        let remoteVideo = this.remoteVideoRef.nativeElement;
        let localVideo = this.localVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            localVideo.srcObject = stream;
            localVideo.play();
            self.peer.on('call', function (call) {
                call.answer(stream);
                call.on('stream', function (remotestream) {
                    remoteVideo.srcObject = remotestream;
                    remoteVideo.play();
                })
            })
        })
    }

    stop() {
        this.peer.close();
        let n = <any>navigator;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            stream.getTracks()[0].stop();
        })
    }

}
