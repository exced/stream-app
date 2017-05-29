import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private socketService: SocketService) { }

    ngOnInit() {

    }

    login() {
        this.loading = true;
        this.socketService.login(this.model.username)
            .subscribe(result => {
                if (result.success) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Username incorrect';
                    this.loading = false;
                }
            });
    }
}
