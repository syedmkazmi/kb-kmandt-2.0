import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IBio} from "../interfaces/Bio";
import {BioService} from "./bio.service";

@Injectable()
export class BioEditResolverService implements Resolve<IBio> {

  constructor(private _bioService: BioService, private _router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBio> {

    const id = route.paramMap.get('id');
    return this._bioService.getBio(id)
      .map((data) => {
        if (data) {
          return data;
        }
        this._router.navigate(['/welcome']);
        return null;
      })
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);
        // re-throw error so you can catch it when subscribing, fallback to generic error code
        //this._notificationService.sendNotification(err.error.message);
        this._router.navigate(['/welcome']);
        return Observable.throw(err || 'API_ERROR');
      });
  }

}
