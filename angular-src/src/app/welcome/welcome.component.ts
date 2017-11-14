import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../authentication/services/authentication.service";

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  title: string = "Main Component";

  constructor(private _authService: AuthenticationService) {
  }

  ngOnInit() {
    const isLoggedIn: boolean = this._authService.isLoggedIn();
    this._authService.sendMessage(isLoggedIn);
  }


}
