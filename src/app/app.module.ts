import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';
import { ConfirmService } from '../services/confirm.service';
import { AppSettingsService } from './app.settings.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { StreamComponent } from './stream/stream.component';
import { ContactComponent } from './contact/contact.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SigninComponent,
    StreamComponent,
    ContactComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    SocketService,
    ConfirmService,
    AppSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
