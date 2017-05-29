import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { AppSettingsService } from '../app.settings.service';

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
        private socketService: SocketService,
        private appSettingsService: AppSettingsService,
    ) {

    }

    ngOnInit() {

    }

    login() {
        this.loading = true;
        this.socketService.login(this.model.username)
            .subscribe(result => {
                if (result.success) {
                    this.appSettingsService.setUsername(this.model.username);
                    this.router.navigate(['/']);
                } else {
                    this.error = result.msg;
                    this.loading = false;
                }
            });
    }
}
