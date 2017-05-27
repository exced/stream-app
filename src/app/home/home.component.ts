import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Notification } from '../../services/socket.service';
import { ConfirmService } from '../../services/confirm.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    users = [];
    notification: Notification; // id for call received notification

    constructor(
        private router: Router,
        private authService: AuthService,
        private socketService: SocketService,
        private confirmService: ConfirmService
    ) {

    }

    ngOnInit() {
        // subscribe user join
        this.socketService.join().subscribe(user => {
            console.log('user join: ' + user);
            this.users.push(user);
        })
        // subscribe user leave
        this.socketService.leave().subscribe(user => {
            let index = this.users.indexOf(user);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        })
        // call subscription
        this.socketService.subscribe().subscribe((notification: Notification) => {
            this.confirmService.activate('Confirm?')
                .then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            this.notification = notification;
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
