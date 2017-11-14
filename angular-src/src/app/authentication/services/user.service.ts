import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { IUser } from "../interfaces/user";


@Injectable()
export class UserService {

  constructor(private _http: HttpClient) {
  }

  getUsers(): Observable <IUser[]>{
    return this._http.get<IUser[]>('http://localhost:3000/api/users', {observe: 'response'})
      .do(data => console.log('All: ' + JSON.stringify(data)))
      .map(data =>  data.body)
      .catch(err => {
        // do whatever you want when error occurres
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err.message.toUpperCase() || 'API_ERROR');
      });
  };

}
