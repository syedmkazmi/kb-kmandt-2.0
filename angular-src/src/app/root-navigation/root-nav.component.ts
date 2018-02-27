import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../authentication/services/authentication.service";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../users/services/user.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-root-nav',
  templateUrl: './root-nav.component.html',
  styleUrls: ['./root-nav.component.css']
})
export class RootNavComponent implements OnInit {

  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;

  isLoggedIn: any;
  name: string;
  _id: string;
  profileImage: string;
  associateView: boolean = false;

  constructor(private _authService: AuthenticationService, private _userService: UserService, private _location: Location) {

  }

  ngOnInit() {
    this.subscription1 = this._authService.getMessage().subscribe(message => {
      this.isLoggedIn = message;
      this.getUserInfo();
    });

    this.subscription2 = this._userService.getMessage().subscribe(data => {
      this.profileImage = data;
    });

    this.subscription3 = this._userService.getMessage().subscribe(data => {
      this.associateView = data;
    });

  }

  private getUserInfo(){
    if(localStorage.getItem("userInfo")){
        this.name = JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName;
        this._id = JSON.parse(localStorage.getItem("userInfo"))._id;
        this.profileImage = localStorage.getItem("profile-img");
    } else {
      console.log("no user info") //TODO: put function here to get user data if local storage is empty
    }
  }

  public goBack() {
    this._location.back();
  }

}
