import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    model: any = {};
    loading = false;
    error = '';

    constructor(private authService: AuthService, private router: Router) {

    }

    ngOnInit() {
    }

    add() {
        this.loading = true;
        this.authService.addContact(this.model.username)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Username is incorrect';
                    this.loading = false;
                }
            });
    }

}
