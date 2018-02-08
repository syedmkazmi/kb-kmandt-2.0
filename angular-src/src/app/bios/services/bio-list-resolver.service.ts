import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IBio} from "../interfaces/Bio";
import {BioService} from "./bio.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Injectable()
export class BioListResolverService implements Resolve<IBio[]>{

  constructor(private _bioService: BioService, private _notificationService: NotificationsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBio[]> {
    //this._spinnerService.displayLoader(true);
    return this._bioService.getAll()
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);
        // re-throw error so you can catch it when subscribing, fallback to generic error code
        this._notificationService.sendNotification(err.error.message);
        return Observable.throw(err || 'API_ERROR');
      });
  }

}
