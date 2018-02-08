import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProposalService} from "../services/proposal.service";
import {NotificationsService} from "../../root/services/notifications.service";
import {HttpErrorResponse} from "@angular/common/http";
import {IProposal} from "../interfaces/proposal";

@Component({
  selector: 'proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css']
})
export class ProposalListComponent implements OnInit {
// @Input() proposals?: IProposal[];
  title: String = "Proposals";
  @Input() proposals: IProposal[];
  filteredProposals: IProposal[];
  selectedProposal: IProposal;
  _listFilter: string;
  queryParam: any = {};
  filterStatus: Boolean = true;
  filterMessage: string;

  constructor(private _proposalService: ProposalService, private _notificationService: NotificationsService, private _route: ActivatedRoute) {
    // this.filteredProposals = this.proposals;
  }

  ngOnInit() {
    // Get proposals from proposal list route resolver service
    this._route.data.subscribe(
      data => {
        this.proposals = data['proposals'];
      }
    );
  }

  proposalList() {
    this._proposalService.getAll()
      .subscribe(data => {
          this.filterStatus = true;
          this.queryParam = {};
          this.proposals = data;
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        }
      )
  }

  filterProposals() {
    this._proposalService.getFiltered(this.queryParam)
      .subscribe(data => {
          if (data.length === 0) {
            this.filterStatus = false;
            this.filterMessage = "Your criteria did not match any data.";
          } else if (data.length > 1) {
            this.filterStatus = true;
            this.proposals = data;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        }
      )
  }

  onSelect(proposal: IProposal) {
    this.selectedProposal = JSON.parse(JSON.stringify(proposal));
  }

}
