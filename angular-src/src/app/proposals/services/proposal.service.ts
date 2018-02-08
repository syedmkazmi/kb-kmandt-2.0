import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from "../../../environments/environment";
import {IProposal} from "../interfaces/proposal";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ProposalService {

  // Used to send the proposal file upload status updates
  private subject = new Subject<any>();

  constructor(private _http: HttpClient) {
  }

  // =======================================================
  // GET ALL PROPOSALS             =========================
  // =======================================================
  getAll(): Observable<IProposal[]> {
    const BASE_URL = environment.apiUrl;

    return this._http.get<IProposal[]>(`${BASE_URL}/api/proposals`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET FILTERED PROPOSALS        =========================
  // =======================================================
  getFiltered(filterOptions: any): Observable<IProposal[]> {
    const BASE_URL = environment.apiUrl;
    return this._http.get<IProposal[]>(`${BASE_URL}/api/proposals`, {params: filterOptions})
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // GET A SINGLE PROPOSAL         =========================
  // =======================================================
  getOne(id): Observable<IProposal> {

    const BASE_URL = environment.apiUrl;

    return this._http.get<IProposal>(`${BASE_URL}/api/proposals/${id}`)
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);

        // re-throw error so you can catch it when subscribing, fallback to generic error code
        return Observable.throw(err || 'API_ERROR');
      });
  }

  // =======================================================
  // CREATE NEW PROPOSAL           =========================
  // =======================================================
  create(body): Observable<IProposal> {
    const BASE_URL = environment.apiUrl;

    return this._http.post<IProposal>(`${BASE_URL}/api/proposals`, body)
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
  // UPDATE PROPOSAL               =========================
  // =======================================================
  update(body, id): Observable<IProposal> {
    const BASE_URL = environment.apiUrl;

    return this._http.put<IProposal>(`${BASE_URL}/api/proposals/${id}`, body)
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
    formData.append('proposal', file, file.name);

    return this._http.post(`${BASE_URL}/api/proposals/${id}`, formData, { responseType: 'text' })
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

  // Used to send the % of file uploaded status
  sendMessage(message: any) {
    this.subject.next(message);
  }

  // Used to receive the % of uploaded status
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}

// Example Code for tracking upload process.

//let req = new HttpRequest('POST', `${BASE_URL}/api/proposals/${id}`, formData, { responseType: 'text' });

//this._http.request(req).subscribe(data => {
//console.log(data);
//return data;
// Via this API, you get access to the raw event stream.
// Look for upload progress events.
/*if (event.type === HttpEventType.UploadProgress) {
  // This is an upload progress event. Compute and show the % done:
  const percentDone = Math.round(100 * event.loaded / event.total);
  console.log(`File is ${percentDone}% uploaded.`);
  this.sendMessage(percentDone);
} else if (event instanceof HttpResponse) {
  console.log('File is completely uploaded!' + HttpResponse);
}*/
/* }, data => {

 });*/
