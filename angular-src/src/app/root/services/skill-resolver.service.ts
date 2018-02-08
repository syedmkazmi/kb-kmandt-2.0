import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ISkill} from "../interfaces/skill";
import {SharedService} from "./shared.service";

@Injectable()
export class SkillResolverService implements Resolve<ISkill>{

  constructor(private _ss: SharedService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <ISkill> {
    return this._ss.getSkills();
    // TODO add error handling here
  }

}
