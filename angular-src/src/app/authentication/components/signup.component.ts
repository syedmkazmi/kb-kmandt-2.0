import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
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
  backgroundImages: string [] = ["assets/images/backgrounds/login-bg.jpg", "assets/images/backgrounds/login-bg-2.jpg", "assets/images/backgrounds/login-bg-3.jpg", "assets/images/backgrounds/login-bg-4.jpg", "assets/images/backgrounds/login-bg-5.jpg", "assets/images/backgrounds/login-bg-6.jpg", "assets/images/backgrounds/login-bg-7.jpg", "assets/images/backgrounds/login-bg-8.jpg", "assets/images/backgrounds/login-bg-9.jpg", "assets/images/backgrounds/login-bg-10.jpg", "assets/images/backgrounds/login-bg-11.jpg", "assets/images/backgrounds/login-bg-12.jpg", "assets/images/backgrounds/login-bg-13.jpg", "assets/images/backgrounds/login-bg-14.jpg", "assets/images/backgrounds/login-bg-15.jpg"];
  registrationSuccess: boolean = false;
  setBgImage: string;
  buttonLoading: boolean = false;

  constructor(private _fb: FormBuilder, private _authenticationService: AuthenticationService, private _notificationService: NotificationsService) {
  }

  ngOnInit() {

    let element = document.getElementById("bg");
    this.setBgImage = this.backgroundImages[this.randomImage()];
    element.setAttribute('style', 'background-image: url(' + this.setBgImage +');');

    this.signupForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', {updateOn: 'blur', validators: [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@kmandt.com$')]}],
      password: ['', Validators.required]
    });
  }


  signUp() {
    this.buttonLoading = true;

    this._authenticationService.signUp({
      "firstName": this.signupForm.value.firstName,
      "lastName": this.signupForm.value.lastName,
      "email": this.signupForm.value.email,
      "password": this.signupForm.value.password
    })
      .subscribe(
        data => {
          this.registrationSuccess = true;
          this.buttonLoading = false;
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
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

  private randomImage() {
    return Math.floor((Math.random() * 14));
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
