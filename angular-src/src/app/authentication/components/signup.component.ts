import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {IUser} from "../interfaces/user";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  title: string = "Sign up";
  signupForm: FormGroup;
  user: IUser[];

  constructor(private _fb: FormBuilder, private _authenticationService: AuthenticationService, private _notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.signupForm = this._fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  signUp() {
    this._authenticationService.signUp({
      "fullName": this.signupForm.value.fullName,
      "email": this.signupForm.value.email,
      "password": this.signupForm.value.password
    })
      .subscribe(
        data => {
          console.log("REG " + data);
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

  /*signup() {

    this._userService.getUsers().subscribe(
      data => {
        this.user = data;
        console.log(data);
        console.log(data)
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
        }
      });
  }*/

}
