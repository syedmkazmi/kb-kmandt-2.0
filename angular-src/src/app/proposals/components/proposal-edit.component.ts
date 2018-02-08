import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProposalService} from "../services/proposal.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "../../root/services/notifications.service";
import {IProposal} from "../interfaces/proposal";
import {ISector} from "../../root/interfaces/sector";
import {Subscription} from "rxjs/Subscription";
import {UploadFile, UploadEvent} from 'ngx-file-drop';
import {IUser} from "../../users/interfaces/user";
import UIkit from 'uikit'

@Component({
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.css']
})
export class ProposalEditComponent implements OnInit {
  title: String = "Edit Proposal";
  proposalEditForm: FormGroup;
  sectors: ISector;
  proposal: IProposal;
  users: IUser[];
  subscription: Subscription;
  percent: any;
  newClient: Boolean;
  proposalShareLink: Boolean;
  UIkit: any;

  constructor(private _fb: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _proposalService: ProposalService,
              private _notificationService: NotificationsService) {
  }

  ngOnInit() {

    // Get the % status the proposal file being uploaded
    this.subscription = this._proposalService.getMessage().subscribe(message => {
      this.percent = message;
    });

    // Setting the proposal form using Form Builder
    this.proposalEditForm = this._fb.group({
      proposalNo: ['', [Validators.required]],
      proposalStatus: ['', [Validators.required]],
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

    // Get proposal from proposal edit route resolver service
    this._route.data.subscribe(
      data => {
        this.onProposalRetrieved(data['proposal']);
      }
    );

    // Get all sectors from sector resolver service
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

  // Handling retrieved proposal from the server
  onProposalRetrieved(proposal: IProposal): void {
    if (this.proposalEditForm) {
      this.proposalEditForm.reset();
    }

    this.proposal = proposal;

    this.proposalEditForm.patchValue({
      proposalNo: this.proposal.proposalNo,
      proposalStatus: this.proposal.proposalStatus,
      proposalRegion: this.proposal.proposalRegion,
      proposalTitle: this.proposal.proposalTitle,
      sector: this.proposal.sector,
      client: this.proposal.client,
      owner: this.proposal.owner,
      ownerEmail: this.proposal.ownerEmail,
      clientContact: this.proposal.clientContact,
      proposalIssueDate: this.proposal.proposalIssueDate,
      responseDate: this.proposal.responseDate,
      totalNumberOfDays: this.proposal.totalNumberOfDays,
      dailyRate: this.proposal.dailyRate,
      expenses: this.proposal.expenses,
      totalValue: this.proposal.totalValue
    });

  }

  capitalizeFirstLetter(data) {
    return data.charAt(0).toUpperCase() + data.slice(1);
  } // TODO: Check significance

  uploadFile(event) {
    this.proposalShareLink = true;
    UIkit.notification({
      message: "<span id='notification-icon' style='color: #0070E0;' uk-icon='icon: bell'></span>  Your file is being prepared for uploading",
      status: 'success',
      pos: 'top-right',
      timeout: 8000
    });

    const files: File = event.target.files[0];
    let id = this._route.snapshot.paramMap.get('id');
    this._proposalService.upload(files, id)
      .subscribe(data => {
        if(data){
          this.proposalShareLink = false;
          UIkit.notification({
            message: "<span id='notification-icon' style='color: #13CE66;' uk-icon='icon: check'></span>  Your file was successfully uploaded",
            status: 'success',
            pos: 'top-right',
            timeout: 9000
          });
        }
        console.log(data);
      },(err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        this.proposalShareLink = false;
        this._notificationService.sendNotification(err.error.message || "unknown error RUN!!!"); //TODO Does not show server 500 error.
        UIkit.notification({
          message: err.error.message || "unknown error RUN!!!",
          status: 'primary',
          pos: 'top-right',
          timeout: 5000
        });
        console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
      }
    });
  }

  // =======================================================
  // SAVE UPDATE PROPOSAL          =========================
  // =======================================================
  save() {
    this.proposalEditForm.controls['totalValue'].setValue(this.calculateTotal(this.proposalEditForm.value.totalNumberOfDays, this.proposalEditForm.value.dailyRate, this.proposalEditForm.value.expenses));

    if (this.proposalEditForm.dirty && this.proposalEditForm.touched) {

      let p = Object.assign({}, this.proposal, this.proposalEditForm.value);
      let id = this._route.snapshot.paramMap.get('id');

      this._proposalService.update(p, id)
        .subscribe(
          () => this.onSaveComplete(),
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
    } else if (!this.proposalEditForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.proposalEditForm.reset();
    this._router.navigate(['/proposals']);
  }

  calculateTotal(totalNumberOfDays, dailyRate, expenses) {
    return (totalNumberOfDays * dailyRate) + expenses;
  }

  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (let file of event.files) {
      file.fileEntry.file(info => {
        let id = this._route.snapshot.paramMap.get('id');
        this._proposalService.upload(info, id)
          .subscribe(data => {
            console.log(data);
          })
      });
    }
  }

  public fileOver(event) {
  }

  public fileLeave(event) {
  }

  public setOwnerEmail(){
    for(let user of this.users){
      if(user.firstName.concat(" ",user.lastName) == this.proposalEditForm.controls['owner'].value){
          this.proposalEditForm.controls['ownerEmail'].setValue(user.email)
      }
    }
  }

  public addNewClient() {
    this.newClient = !this.newClient;
  }


}
