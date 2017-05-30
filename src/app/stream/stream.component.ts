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
    private localStream: any;
    private remoteStream: any;
    private playing: boolean = false;

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
        this.playing = true;
        let remoteVideo = this.remoteVideoRef.nativeElement;
        let localVideo = this.localVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            // ref to close
            self.localStream = stream;
            localVideo.srcObject = stream;
            localVideo.play();
            let call = self.peer.call(self.remotePeerid, stream);
            call.on('stream', function (remotestream) {
                // ref to close
                self.remoteStream = remotestream;
                remoteVideo.srcObject = remotestream;
                remoteVideo.play();
            });
        })
    }

    call() {
        this.playing = true;
        this.socketService.call(this.userid);
        let remoteVideo = this.remoteVideoRef.nativeElement;
        let localVideo = this.localVideoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            // ref to close
            self.localStream = stream;
            localVideo.srcObject = stream;
            localVideo.play();
            self.peer.on('call', function (call) {
                call.answer(stream);
                call.on('stream', function (remotestream) {
                    // ref to close
                    self.remoteStream = remotestream;
                    remoteVideo.srcObject = remotestream;
                    remoteVideo.play();
                })
            });
        })
    }

    stop() {
        this.playing = false;
        this.remoteStream.getTracks().forEach(function (track) { track.stop() })
        this.localStream.getTracks().forEach(function (track) { track.stop() })
        let remoteVideo = this.remoteVideoRef.nativeElement;
        let localVideo = this.localVideoRef.nativeElement;
        remoteVideo.srcObject = null;
        localVideo.srcObject = null;
    }

}
