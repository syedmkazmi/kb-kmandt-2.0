import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IIcon} from "../interfaces/icon";
import {SharedService} from "./shared.service";


@Injectable()
export class IconResolverService implements Resolve<IIcon> {

  constructor(private _ss: SharedService) {
  }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IIcon> {
    return this._ss.getIcons()
    // TODO add error handling here
  }
}
