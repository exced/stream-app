import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
        private authService: AuthService,
        private socketService: SocketService,
        private confirmService: ConfirmService,
    ) {

    }

    ngOnInit() {
        this.token = this.authService.getToken();
        // call subscription
        this.socketService.subscribe(this.token).subscribe((notification: Notification) => {
            this.confirmService.activate('Confirm?')
                .then(result => {
                    if (result) {
                        // accept
                        let confirm: Confirm = {confirmed: true, socketid: notification.socketid}
                        this.confirmService.setConfirm(confirm);
                        this.router.navigate(['/user/' + notification.from]);
                    } else {
                        // hangup
                    }
                }).catch(error => {
                    console.log(error);
                });
            this.notification = notification;
        });
        // subscribe users
        this.socketService.users(this.token).subscribe(users => {
            console.log('USERS');
            console.log(users);
            this.users = users;
        })
        // subscribe user join
        this.socketService.join().subscribe(user => {
            console.log("join");
            let index = this.users.indexOf(user);
            if (index <= -1) {
                this.users.push(user);
            }
        })
        // subscribe user leave
        this.socketService.leave().subscribe(user => {
            console.log("leave");
            let index = this.users.indexOf(user);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        })
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
