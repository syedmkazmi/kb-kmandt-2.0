import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import {tap, catchError, map} from "rxjs/operators";
import {IAuthToken} from "../interfaces/userToken";
import {Router} from "@angular/router";
import {Subject} from 'rxjs/Subject';
import * as moment from "moment";
import {environment} from "../../../environments/environment";
import {UserService} from "../../users/services/user.service";

@Injectable()
export class AuthenticationService {
  private subject = new Subject<any>();

  constructor(private _http: HttpClient, private _router: Router, private _userService: UserService) {
  }

  signUp(body): Observable<IAuthToken> {

    const BASE_URL = environment.apiUrl;

    return this._http.post<IAuthToken>(BASE_URL + '/api/register', body)
      .do(data => console.log(data))
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
    //return body
  }

  login(body): Observable<IAuthToken> {

    const BASE_URL = environment.apiUrl;

    return this._http.post<IAuthToken>(BASE_URL + '/api/login', body)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        map(data => {
          const token = data.token;
          const unit: moment.unitOfTime.DurationConstructor = 'hour';
          const expiresIn = moment().add(168, unit);
          const userInfo = data.userInfo;
          const profileImg =  data.profileImg;

          if (token) {
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("expiresIn", JSON.stringify(expiresIn));
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            localStorage.setItem("profile-img",profileImg);
            this._router.navigate(['/'])
          }
          return data;
        }),
        catchError(err => {
          // do whatever you want when error occurs
          console.log(err);

          // re-throw error so you can catch it when subscribing, fallback to generic error code
          return Observable.throw(err || 'API_ERROR');
        }))
    //.do(data => console.log(JSON.stringify(data)))
    /*.map(data => {

      const token = data.token;
      const unit: moment.unitOfTime.DurationConstructor = 'hour';
      const expiresIn = moment().add(1, unit);
      const userInfo = data.userInfo;

      if (token) {
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expiresIn", JSON.stringify(expiresIn));
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        this._router.navigate(['/'])
      }
      return token;
    })*/
    /*.catch(err => {
      // do whatever you want when error occurs
      console.log(err);

      // re-throw error so you can catch it when subscribing, fallback to generic error code
      return Observable.throw(err || 'API_ERROR');
    });*/
  }

  requestPasswordReset(body): Observable<any> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<any>(BASE_URL + '/api/password/reset', body)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        map(data => {
          return data;
        }),
        catchError(err => {
          // do whatever you want when error occurs
          console.log(err);

          // re-throw error so you can catch it when subscribing, fallback to generic error code
          return Observable.throw(err || 'API_ERROR');
        }))
  }

  passwordReset(body, token): Observable<any> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<any>(BASE_URL + '/api/password/reset/' + token, body)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        map(data => {
          return data;
        }),
        catchError(err => {
          // do whatever you want when error occurs
          console.log(err);

          // re-throw error so you can catch it when subscribing, fallback to generic error code
          return Observable.throw(err || 'API_ERROR');
        }))
  }

  public isLoggedOut() {
    localStorage.removeItem('expiresIn');
    this._router.navigate(['/login']);
    this.sendMessage(this.isLoggedIn());
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(AuthenticationService.getExpiration());
  }

  static getExpiration() {
    const expiration = localStorage.getItem('expiresIn');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
