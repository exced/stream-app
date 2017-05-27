import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contacts = ["thomas1", "thomas2"];

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // subscribe connected contacts
  }

  /**
   * add contact
   */
  add() {
    this.authService.addContact() {
      
    }
  }

  /**
   * call contact
   */
  call() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
