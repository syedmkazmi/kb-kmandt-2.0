import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private _router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .do(event => {
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(['/login']);
            }
          }
        });
  }


}
