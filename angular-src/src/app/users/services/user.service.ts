import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { IUser } from "../interfaces/user";
import {environment} from "../../../environments/environment";
import {IProposal} from "../../proposals/interfaces/proposal";
import {HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class UserService {
  private subject = new Subject<any>();

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

  getOne(id): Observable <IUser>{
    const BASE_URL = environment.apiUrl;

    return this._http.get<IProposal>(`${BASE_URL}/api/users/${id}`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }


  setProfileImage(id, body): Observable <IUser>{
    const BASE_URL = environment.apiUrl;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let encodedImage = encodeURIComponent(body);

    return this._http.put<IUser>(`${BASE_URL}/api/users/${id}/photo`, encodedImage, options)
      .map(data => {
        return data;
      })
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
