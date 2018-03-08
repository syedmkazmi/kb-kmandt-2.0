import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login.component';
import {RouterModule} from "@angular/router";
import {SignupComponent} from './components/signup.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {LoginGuard} from "./guards/login.guard";
import {NotificationsComponent} from "../root/components/notifications.component";
import { SignupSuccessComponent } from './components/signup-success.component';
import { PasswordResetComponent } from './components/password-reset.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
      {path: 'signup', component: SignupComponent, canActivate: [LoginGuard]},
      {path: 'signup/success', component: SignupSuccessComponent, canActivate: [LoginGuard]},
      {path: 'password/reset/:token', component: PasswordResetComponent, canActivate: [LoginGuard]}
    ]),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [LoginComponent, SignupComponent, NotificationsComponent, SignupSuccessComponent, PasswordResetComponent]
})
export class AuthenticationModule {
}
