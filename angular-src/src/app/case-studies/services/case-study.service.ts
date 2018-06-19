import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {ICasestudy} from "../interfaces/casestudy";


@Injectable()
export class CaseStudyService {

  constructor(private _http: HttpClient) {
  }

  // =======================================================
  // CREATE NEW CASE STUDY           =======================
  // =======================================================
  create(body): Observable<ICasestudy> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<ICasestudy>(`${BASE_URL}/api/casestudies`, body)
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

  // =======================================================
  // GET ALL CASE STUDIES            =======================
  // =======================================================

  get(): Observable<ICasestudy[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<ICasestudy[]>(`${BASE_URL}/api/casestudies`)
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

  // =======================================================
  // GET ALL CASE STUDIES            =======================
  // =======================================================

  getPending(): Observable<ICasestudy[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<ICasestudy[]>(`${BASE_URL}/api/casestudies/pending`)
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
  // =======================================================
  // GET A CASE STUDY                =======================
  // =======================================================

  getOne(id): Observable<ICasestudy> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<ICasestudy>(`${BASE_URL}/api/casestudies/` + id)
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

  // =======================================================
  // UPDATE A CASE STUDY             =======================
  // =======================================================

  update(body, id): Observable<ICasestudy> {
    const BASE_URL = environment.apiUrl;

    return this._http.put<ICasestudy>(`${BASE_URL}/api/casestudies/` + id, body)
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

  // =======================================================
  // UPLOAD PROPOSAL File          =========================
  // =======================================================
  upload(file, id): Observable<any> {
    const BASE_URL = environment.apiUrl;

    let formData = new FormData();
    formData.append('casestudy', file, file.name);

    return this._http.post(`${BASE_URL}/api/caseStudies/${id}`, formData, { responseType: 'text' })
      .map(data => {
        return data;
      })
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });

  } //TODO: Create a separate "upload" component?

  // =======================================================
  // GET FILTERED CASE STUDIES     =========================
  // =======================================================
  getFiltered(filterOptions: any): Observable<ICasestudy[]> {
    const BASE_URL = environment.apiUrl;
    return this._http.get<ICasestudy[]>(`${BASE_URL}/api/casestudies`, {params: filterOptions})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET CASE STUDY FILES            =======================
  // =======================================================
  getCaseStudyFiles() {
    const BASE_URL = environment.apiUrl;

    /*return this._http.post<any[]>(`${BASE_URL}/api/casestudies`,{})
      .map(data => {return data})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });*/
  }

  // =======================================================
  // GET ALL BASIC FILES             =======================
  // =======================================================
  downloadFile(data): Observable<any[]> {
    const BASE_URL = environment.apiUrl;

    let body = {
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
