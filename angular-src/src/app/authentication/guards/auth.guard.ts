import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this._authService.isLoggedIn();
    if (isLoggedIn) {
      //return true and proceed with the route
      return true;
    }
    this._router.navigate(['/login']);
    return false;
  }

}
