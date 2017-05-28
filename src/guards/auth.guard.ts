import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {

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
