import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  buttonLoading: boolean = false;
  success: boolean = false;

  constructor(private _route: ActivatedRoute, private _fb: FormBuilder, private _authService: AuthenticationService, private _notificationService: NotificationsService, private _router: Router) {
  }

  ngOnInit() {
    this.passwordResetForm = this._fb.group({
      password: ['', [Validators.required]]
    })
  }

  password() {
    this.buttonLoading = true;
    let token = this._route.snapshot.paramMap.get('token');

    this._authService.passwordReset({"password": this.passwordResetForm.value.password}, token)
      .subscribe(
        () => {
          this.buttonLoading = false;
          this.success = true;
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.buttonLoading = false;
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this.buttonLoading = false;
            this._notificationService.sendNotification(err.error.message);
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        }
      )
  }

}
