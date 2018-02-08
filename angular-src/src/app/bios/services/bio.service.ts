import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEventType, HttpResponse} from "@angular/common/http";
import {ResponseContentType} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from "../../../environments/environment";
import 'rxjs/add/operator/delay';
import {IBio} from "../interfaces/Bio";

@Injectable()
export class BioService {

  constructor(private _http: HttpClient) {}

  getAll(): Observable<IBio[]>{
    const BASE_URL = environment.apiUrl;

    return this._http.get<IBio>(`${BASE_URL}/api/bios`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  addBio(body): Observable<IBio> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<IBio>(BASE_URL + '/api/bios', body)
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

  getBio(id): Observable<IBio> {

    const BASE_URL = environment.apiUrl;

    return this._http.get<IBio>(`${BASE_URL}/api/bios/${id}`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  editBio(body, id): Observable<IBio> {
    const BASE_URL = environment.apiUrl;
    console.log("BIO " + body);
    return this._http.put<IBio>(BASE_URL + '/api/bios/' + id, body)
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

  pdfBio(body, id): Observable<any> {
    const BASE_URL = environment.apiUrl;

    return this._http.post(BASE_URL + '/api/bios/'+id+'/pdf', body, { responseType: 'text' })
      .map(data => {
        console.log(data);
        let test = data.replace("?dl=0", "?dl=1");
        let url = test.replace(/['"]+/g, '');
        //let url = test + '?dl=1';
        console.log(url);
        console.log(JSON.stringify(test));
        return url;
      })
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }



}
