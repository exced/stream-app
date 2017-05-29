import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Notification } from '../../services/socket.service';
import { ConfirmService } from '../../services/confirm.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { Confirm } from '../../services/confirm.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    users = [];
    notification: Notification; // id for call received notification
    token: string;

    constructor(
        private router: Router,
        private socketService: SocketService,
        private confirmService: ConfirmService,
    ) {

    }

    ngOnInit() {
        // call subscription
        this.socketService.subscribe().subscribe((notification: Notification) => {
            this.confirmService.activate('Confirm?')
                .then(result => {
                    if (result) {
                        // accept
                        let confirm = { confirmed: true, peerid: notification.peerid };
                        this.confirmService.setConfirm(confirm);
                        console.log('CONFIRM');
                        console.log(notification);
                        this.router.navigate(['/user/' + notification.from]);
                    } else {
                        // hangup
                    }
                }).catch(error => {
                    console.log(error);
                });
            this.notification = notification;
        });
        // subscribe users - only one time
        this.socketService.users(this.token).subscribe(users => {
            this.users = users;
        })
        // subscribe user join
        this.socketService.join().subscribe(user => {
            let index = this.users.indexOf(user);
            if (index <= -1) {
                this.users.push(user);
            }
        })
        // subscribe user leave
        this.socketService.leave().subscribe(user => {
            let index = this.users.indexOf(user);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        })
    }

}
