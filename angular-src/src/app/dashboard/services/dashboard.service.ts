import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {IProposal} from "../../proposals/interfaces/proposal";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {IBio} from "../../bios/interfaces/Bio";



@Injectable()
export class DashboardService {

  constructor(private _http: HttpClient) { }

  // =======================================================
  // GET ALL PROPOSALS FOR THIS USER =======================
  // =======================================================
  getProposals(id): Observable<IProposal[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<IProposal[]>(`${BASE_URL}/api/users/${id}/proposals`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET ALL BIOS FOR THIS USE     =========================
  // =======================================================
  getBios(id): Observable<IBio[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<IBio[]>(`${BASE_URL}/api/users/${id}/bios`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET MARKETING FILES             =======================
  // =======================================================
  getMarketingFiles(): Observable<any[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<any[]>(`${BASE_URL}/api/templates/marketing`,{})
      .map(data => {return data})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET HR FILES                    =======================
  // =======================================================
  getHumanResourceFiles(): Observable<any[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<any[]>(`${BASE_URL}/api/templates/hr`,{})
      .map(data => {return data})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET HR FILES                    =======================
  // =======================================================
  getClientFiles(): Observable<any[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<any[]>(`${BASE_URL}/api/templates/client`,{})
      .map(data => {return data})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET ALL BASIC FILES             =======================
  // =======================================================
  downloadFile(data): Observable<any[]> {
    const BASE_URL = environment.apiUrl;

    let  body = {
      path: data
    };

    return this._http.post<any[]>(`${BASE_URL}/api/templates/download`, body)
      .map(data => {return data})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

}
