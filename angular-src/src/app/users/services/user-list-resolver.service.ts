import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IUser} from "../interfaces/user";
import {SharedService} from "../../root/services/shared.service";

@Injectable()
export class UserListResolverService implements Resolve<IUser[]> {

  constructor(private _ss: SharedService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser[]> {
    return this._ss.getUserList();
    // TODO add error handling here
  }

}
