import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ISector} from "../interfaces/sector";
import {SharedService} from "./shared.service";

@Injectable()
export class SectorResolverService implements Resolve<ISector>{

  constructor(private _ss: SharedService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <ISector> {
    return this._ss.getSectors();
    // TODO add error handling here
  }

}
