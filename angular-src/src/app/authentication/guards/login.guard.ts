import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private _router: Router, private _authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this._authService.isLoggedIn();
    if (isLoggedIn) {
      //it true then DON'T proceed to route and go to welcome.
      this._router.navigate(['/welcome']);
      return false;
    }

    return true;
  }

}
