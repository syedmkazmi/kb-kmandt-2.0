import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {NotificationsService} from "../../root/services/notifications.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title: string = `Welcome to the Knowledge Base
 you can login below`;
  loginForm: FormGroup;
  backgroundImages: string [] = ["assets/images/backgrounds/login-bg.jpg", "assets/images/backgrounds/login-bg-2.jpg", "assets/images/backgrounds/login-bg-3.jpg", "assets/images/backgrounds/login-bg-4.jpg", "assets/images/backgrounds/login-bg-5.jpg", "assets/images/backgrounds/login-bg-6.jpg", "assets/images/backgrounds/login-bg-7.jpg", "assets/images/backgrounds/login-bg-8.jpg", "assets/images/backgrounds/login-bg-9.jpg", "assets/images/backgrounds/login-bg-10.jpg", "assets/images/backgrounds/login-bg-11.jpg", "assets/images/backgrounds/login-bg-12.jpg", "assets/images/backgrounds/login-bg-13.jpg", "assets/images/backgrounds/login-bg-14.jpg", "assets/images/backgrounds/login-bg-15.jpg"];
  setBgImage: string;
  buttonLoading: boolean = false;

  constructor(private _fb: FormBuilder, private _authService: AuthenticationService, private _notificationService: NotificationsService, private _router: Router) {
  }

  ngOnInit() {

    let element = document.getElementById("bg");
    this.setBgImage = this.backgroundImages[this.randomImage()];
    element.setAttribute('style', 'background-image: url(' + this.setBgImage +');');

    //this.setBgImage = this.backgroundImages[this.randomImage()];

    this.loginForm = this._fb.group({
      email: ['', {updateOn: 'blur', validators: [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@kmandt.com$')]}],
      password: ['',  [Validators.required]]
    });
  }

  logIn() {

    this.buttonLoading = true;
    this._authService.login({"email": this.loginForm.value.email, "password": this.loginForm.value.password})
      .subscribe(
        () => {
          this.buttonLoading = false;
              console.log("Successfully LoggedIn")
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

  private randomImage() {
    return Math.floor((Math.random() * 14));
  }

}
