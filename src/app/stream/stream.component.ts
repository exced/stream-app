import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { Notification } from '../../services/socket.service';
import { ConfirmService } from '../../services/confirm.service';
import { Confirm } from '../../services/confirm.service';

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

    @ViewChild('video') videoRef: any;

    contactname: string;
    token: string;
    confirm: Confirm;

    constructor(private socketService: SocketService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private confirmService: ConfirmService,
    ) {
        // call confirm subscription
        confirmService.getConfirm().subscribe(confirm => {
            this.confirm = confirm;
        });
    }

    ngOnInit() {
        // token
        this.token = this.authService.getToken();
        // route contactid subscription
        this.route.params
            .subscribe((params) => {
                this.contactname = params['userid'];
                // call answer
                if (this.confirm.confirmed) {
                    this.receive(this.confirm.socketid);
                }
            });
    }

    call() {
        // server subscription to receive valid id to stream
        this.socketService.call(this.token, this.contactname).subscribe((notification: Notification) => {
            this.send(notification.socketid);
        })
    }

    receive(socketid: string) {
        console.log('RECEIVE');
        let video = this.videoRef.nativeElement;
        this.socketService.receive(socketid).subscribe((data) => {
            video.src = URL.createObjectURL(data);
            video.play();
        })
    }

    send(socketid: string) {
        console.log('SEND');
        // video streaming
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        let self = this;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            self.socketService.send(socketid, stream);
        });
    }

    stop() {
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        n.mediaDevices.stop();
    }

}
