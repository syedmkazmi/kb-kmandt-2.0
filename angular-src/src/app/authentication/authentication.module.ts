import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login.component';
import {RouterModule} from "@angular/router";
import {SignupComponent} from './components/signup.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {LoginGuard} from "./guards/login.guard";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
      {path: 'signup', component: SignupComponent, canActivate: [LoginGuard]}
    ]),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class AuthenticationModule {
}
