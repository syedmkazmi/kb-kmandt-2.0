import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ICasestudy} from "../interfaces/casestudy";
import {CaseStudyService} from "./case-study.service";
import {NotificationsService} from "../../root/services/notifications.service";


@Injectable()
export class CaseStudyListResolverService implements Resolve<ICasestudy[]> {

  constructor(private _caseStudyService: CaseStudyService, private _notificationService: NotificationsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //this._spinnerService.displayLoader(true);
    return this._caseStudyService.get()
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);
        // re-throw error so you can catch it when subscribing, fallback to generic error code
        this._notificationService.sendNotification(err.error.message);
        return Observable.throw(err || 'API_ERROR');
      });
  }

}
