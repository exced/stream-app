import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';
import { AppSettingsService } from './app.settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, SocketService, AppSettingsService]
})
export class AppComponent {

}
