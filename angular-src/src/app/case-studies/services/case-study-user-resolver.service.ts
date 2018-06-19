import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IUser} from "../../users/interfaces/user";
import {UserService} from "../../users/services/user.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Injectable()
export class CaseStudyUserResolverService implements Resolve<IUser> {

  constructor(private _userService: UserService, private _notificationService: NotificationsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
    const id = JSON.parse(localStorage.getItem("userInfo"))._id;

    return this._userService.getOne(id)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);
        // re-throw error so you can catch it when subscribing, fallback to generic error code
        this._notificationService.sendNotification(err.error.message);
        return Observable.throw(err || 'API_ERROR');
      });
  }
}
