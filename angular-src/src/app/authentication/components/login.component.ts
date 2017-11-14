import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title: string = "Login";
  loginForm: FormGroup;
  isLoggedIn: boolean = false;

  constructor(private _fb: FormBuilder, private _authService: AuthenticationService, private _notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@kmandt.com$')]],
      password: ['', Validators.required]
    });
  }

  logIn() {
    this._authService.login({"email": this.loginForm.value.email, "password": this.loginForm.value.password})
      .subscribe(
        data => {
          console.log("Login Token" + data)
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this._notificationService.sendNotification(err.error.message);
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        }
      )
  }

}
