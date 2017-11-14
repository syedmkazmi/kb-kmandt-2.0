import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {NavigationStart, Router} from "@angular/router";

@Injectable()
export class NotificationsService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private _router: Router) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          this.keepAfterNavigationChange = false;
        } else {
          this.clearNotifications();
        }
      }
    })
  }

  sendNotification(message: any) {
    this.subject.next(message);
  }

  getNotfication(): Observable<any> {
    return this.subject.asObservable();
  }

  clearNotifications() {
    this.subject.next();
  }

}
