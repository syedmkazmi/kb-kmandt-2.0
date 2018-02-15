import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from "../../users/services/user.service";
import {Observable} from "rxjs/Observable";
import {IUser} from "../../users/interfaces/user";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserDetailsGuard implements CanActivate {

  constructor(private _userService: UserService, private _router: Router, private _http: HttpClient) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const BASE_URL = environment.apiUrl;
    const id = JSON.parse(localStorage.getItem("userInfo"))._id;

    return this._http.get<IUser>(`${BASE_URL}/api/users/${id}`)
      .map((data) => {
        if (data.jobTitle == null || data.sector == null || data.region == null || data.lineManagerEmail == null) {
          // Route To Welcome to ask users to add more details
          this._router.navigate(['/welcome']);
             return false;
        } else {
             return true;
        }
      })
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.of(false);
      });
  }

}
