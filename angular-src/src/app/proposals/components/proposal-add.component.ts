import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProposalService} from "../services/proposal.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../../authentication/services/authentication.service";
import {NotificationsService} from "../../root/services/notifications.service";
import {SharedService} from "../../root/services/shared.service";
import {IProposal} from "../interfaces/proposal";
import {ISector} from "../../root/interfaces/sector";
import {IUser} from "../../users/interfaces/user";

@Component({
  selector: 'app-proposal-add',
  templateUrl: './proposal-add.component.html',
  styleUrls: ['./proposal-add.component.css']
})
export class ProposalAddComponent implements OnInit {

  title: String = "Create Proposal";
  proposalForm: FormGroup;
  sectors: ISector;
  proposal: IProposal;
  newClient: Boolean;
  users: IUser[];

  constructor(private _fb: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _proposalService: ProposalService,
              private _notificationService: NotificationsService) {
  }

  ngOnInit() {

    this.proposalForm = this._fb.group({
      proposalRegion: ['', [Validators.required]],
      proposalTitle: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      client: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      ownerEmail: ['', [Validators.required]],
      clientContact: ['', [Validators.required]],
      proposalIssueDate: ['', [Validators.required]],
      responseDate: ['', [Validators.required]],
      totalNumberOfDays: ['', [Validators.required]],
      dailyRate: ['', [Validators.required]],
      expenses: ['', [Validators.required]],
      totalValue: ['', [Validators.required]]
    });

    this._route.data.subscribe(
      data => {
        this.sectors = data['sector'];
      }
    );

    // Get all users from user list resolver service
    this._route.data.subscribe(
      data => {
        this.users = data['users'];
      }
    );

  }

  addNewClient() {
    this.newClient = !this.newClient;
  }

  // =======================================================
  // SAVE NEW PROPOSAL             =========================
  // =======================================================
  save() {
    this.proposalForm.controls['totalValue'].setValue(this.calculateTotal(this.proposalForm.value.totalNumberOfDays, this.proposalForm.value.dailyRate, this.proposalForm.value.expenses));

    if (this.proposalForm.dirty && this.proposalForm.touched) {
      let p = Object.assign({}, this.proposal, this.proposalForm.value);

      this._proposalService.create(p)
        .subscribe(() => this.onSaveComplete(),
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
    } else if (!this.proposalForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.proposalForm.reset();
    this._router.navigate(['/proposals']);
  }

  calculateTotal(totalNumberOfDays, dailyRate, expenses) {
    return (totalNumberOfDays * dailyRate) + expenses;
  }

  public setOwnerEmail(){
    for(let user of this.users){
      if(user.firstName.concat(" ",user.lastName) == this.proposalForm.controls['owner'].value){
        this.proposalForm.controls['ownerEmail'].setValue(user.email)
      }
    }
  }

}
