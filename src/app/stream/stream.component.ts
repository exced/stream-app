import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

    @ViewChild('video') videoRef: any;

    constructor() {
        
    }

    ngOnInit() {
    }

    call() {
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        n.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }

    stop() {
        let video = this.videoRef.nativeElement;
        let n = <any>navigator;
        n.mediaDevices.stop();
    }

}
