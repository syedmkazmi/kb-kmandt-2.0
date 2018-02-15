import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AuthenticationService} from "../../authentication/services/authentication.service";
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from "@angular/router";
import {SpinnerService} from "../spinner.service";
import {RouterEvent} from "@angular/router";
import UIkit from 'uikit'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {

  public loading: boolean = false;

  constructor(private _router: Router, private _authService: AuthenticationService, private _spinnerService: SpinnerService) {
    _router.events.subscribe((routerEvent: RouterEvent) => {
      if (routerEvent instanceof NavigationStart) {
        this.loading = true;
      } else if (routerEvent instanceof NavigationError || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationEnd) {
        this.loading = false;
        window.scrollTo(0, 0)
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
  }

}
