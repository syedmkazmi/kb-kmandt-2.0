import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication/services/authentication.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-root-nav',
  templateUrl: './root-nav.component.html',
  styleUrls: ['./root-nav.component.css']
})
export class RootNavComponent implements OnInit {

  subscription: Subscription;
  message: any;
  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    this.subscription = this._authService.getMessage().subscribe(message => { this.message = message; });
  }

}
