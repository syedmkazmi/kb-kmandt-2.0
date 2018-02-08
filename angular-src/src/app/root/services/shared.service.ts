import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from "../../../environments/environment";
import {ISector} from "../interfaces/sector";
import {ISkill} from "../interfaces/skill";
import {IIcon} from "../interfaces/icon";
import {IUser} from "../../users/interfaces/user";
import {map} from "rxjs/operator/map";

@Injectable()
export class SharedService {

  constructor(private _http: HttpClient) {
  }

  getSectors(): Observable<ISector> {

    const BASE_URL = environment.apiUrl;

     return this._http.get<ISector>(BASE_URL + '/api/sectors')
      .do(data => console.log(data))
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  getSkills(): Observable<ISkill> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<ISkill>(BASE_URL + '/api/skills')
      .do(data => console.log(data))
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  getIcons(): Observable<IIcon>{
    const BASE_URL = environment.apiUrl;

    return this._http.get<IIcon>(BASE_URL + '/api/icons')
      .do(data => console.log(data))
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  getUserList(): Observable<IUser[]>{
    const BASE_URL = environment.apiUrl;

    return this._http.get<IUser[]>(BASE_URL + '/api/users')
      .do(data => console.log(data))
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  getWindowRef() {
    return window;
  }

}
