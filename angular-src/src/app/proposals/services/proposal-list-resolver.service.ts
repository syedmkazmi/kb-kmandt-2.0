import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {IProposal} from "../interfaces/proposal";
import {SpinnerService} from "../../root/spinner.service";
import {ProposalService} from "./proposal.service";
import {NotificationsService} from "../../root/services/notifications.service";

@Injectable()
export class ProposalListResolverService implements Resolve<IProposal[]> {

  constructor(private _proposalService: ProposalService, private _spinnerService: SpinnerService, private _notificationService: NotificationsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProposal[]> {
    //this._spinnerService.displayLoader(true);
    return this._proposalService.getAll()
      .catch(err => {
        // do whatever you want when error occurs
        console.log(err);
        // re-throw error so you can catch it when subscribing, fallback to generic error code
        this._notificationService.sendNotification(err.error.message);
        return Observable.throw(err || 'API_ERROR');
      });
  }
}
