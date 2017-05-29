import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: SocketService) {

    }

    canActivate() {
        //DEBUG if (this.authService.getToken()) {
        //    return true;
        //}
        return true;
        //this.router.navigate(['/login']);
        //return false;
    }
}
