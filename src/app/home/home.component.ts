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

    contacts = ["thomas1", "thomas2"];
    notification: Notification; // id for call received notification

    constructor(
        private router: Router,
        private authService: AuthService,
        private socketService: SocketService,
        private confirmService: ConfirmService
    ) { }

    ngOnInit() {
        // subscribe connected contacts

        // call subscription
        this.socketService.notify().subscribe((notification: Notification) => {
            this.confirmService.activate('Confirm?')
                .then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            this.notification = notification;
        });
    }

    add() {
        this.router.navigate(['/contact']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
