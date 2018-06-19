import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ICasestudy} from "./interfaces/casestudy";
import {ISector} from "../root/interfaces/sector";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {CaseStudyService} from "./services/case-study.service";
import {NotificationsService} from "../root/services/notifications.service";
import UIkit from 'uikit'
import {ISkill} from "../root/interfaces/skill";

@Component({
  selector: 'app-case-study-edit',
  templateUrl: './case-study-edit.component.html',
  styleUrls: ['./case-study-edit.component.css']
})
export class CaseStudyEditComponent implements OnInit {

  title: String = "Edit Case Study";
  newClient: Boolean;
  caseStudyShareLink: Boolean;
  UIkit: any;

  //FORM GROUP
  caseStudyEditForm: FormGroup;

  //INTERFACES
  caseStudy: ICasestudy;
  sectors: ISector;
  skills: ISkill;

  constructor(private _router: Router, private _route: ActivatedRoute, private _fb: FormBuilder, private _caseStudyService: CaseStudyService, private _notificationService: NotificationsService) { }

  ngOnInit() {

    // Setting Up the fields for the Case Study Add Form
    this.caseStudyEditForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      region: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      lineManagerEmail: ['', [Validators.required]],
      title: ['', [Validators.required]],
      proposalNo: [''],
      client: ['', [Validators.required]],
      background: ['', [Validators.required]],
      businessCase: ['', [Validators.required]],
      approach: ['', [Validators.required]],
      results: ['', [Validators.required]],
      caseStudyNo: ['', [Validators.required]],
      caseStudyStatus: ['', [Validators.required]],
      skills: ['', [Validators.required]]
    });

    // Get all sector from user sector resolver service
    this._route.data.subscribe(data => {
      this.sectors = data['sector']
    });

    // Get the User Details from Case Study User resolver service & set the User photo
    this._route.data.subscribe(data => {
      this.onCaseStudyRetrieved(data['caseStudy']);
    });

    // Get the Skills List from Skills List resolver service
    this._route.parent.data.subscribe(data => {
      this.skills = data['skill'];
    });

  }

  onCaseStudyRetrieved(caseStudy): void {
    if (this.caseStudyEditForm) {
      this.caseStudyEditForm.reset();
    }
    // Set retrieved bio to the local "this.bio" variable.
    this.caseStudy = caseStudy;

    this.caseStudyEditForm.patchValue({
      firstName: this.caseStudy.firstName,
      lastName: this.caseStudy.lastName,
      region: this.caseStudy.region,
      sector: this.caseStudy.sector,
      lineManagerEmail: this.caseStudy.lineManagerEmail,
      title: this.caseStudy.title,
      proposalNo: this.caseStudy.proposalNo,
      client: this.caseStudy.client,
      background: this.caseStudy.background,
      businessCase: this.caseStudy.businessCase,
      results: this.caseStudy.results,
      approach: this.caseStudy.approach,
      caseStudyNo: this.caseStudy.caseStudyNo,
      caseStudyStatus: this.caseStudy.caseStudyStatus
    });

    // Set the values for the reactive form control titled "skills"
    this.caseStudyEditForm.setControl('skills', this._fb.array(this.caseStudy.skills || []));

  }

  save(){
    if (this.caseStudyEditForm.dirty) {

      let p = Object.assign({}, this.caseStudy, this.caseStudyEditForm.value);
      let id = this._route.snapshot.paramMap.get('id');

      this._caseStudyService.update(p, id)
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
    } else if (!this.caseStudyEditForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.caseStudyEditForm.reset();
    this._router.navigate(['/casestudies']);
  }

  uploadFile(event) {
    this.caseStudyShareLink = true;
    UIkit.notification({
      message: "<span id='notification-icon' style='color: #0070E0;' uk-icon='icon: bell'></span>  Your file is being prepared for uploading",
      status: 'success',
      pos: 'top-right',
      timeout: 8000
    });

    const files: File = event.target.files[0];
    let id = this._route.snapshot.paramMap.get('id');
    this._caseStudyService.upload(files, id)
      .subscribe(data => {
        if(data){
          this.caseStudyShareLink = false;
          UIkit.notification({
            message: "<span id='notification-icon' style='color: #13CE66;' uk-icon='icon: check'></span>  Your file was successfully uploaded",
            status: 'success',
            pos: 'top-right',
            timeout: 9000
          });
        }
        console.log(data);
        this._router.navigate(['/casestudies']);
      },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          this.caseStudyShareLink = false;
          this._notificationService.sendNotification(err.error.message || "unknown error"); //TODO Does not show server 500 error.
          UIkit.notification({
            message: err.error.message || "unknown error",
            status: 'primary',
            pos: 'top-right',
            timeout: 5000
          });
          console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
        }
      });
  }

  addNewClient(){
    this.newClient = !this.newClient;
  }

  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.caseStudyEditForm.controls.skills;
    if (isChecked) {
      skillsArray.push(new FormControl(skill));
      localStorage.setItem('caseStudySkills', JSON.stringify(skillsArray.value));
    } else {
      let index = skillsArray.controls.findIndex(x => x.value == skill);
      skillsArray.removeAt(index);
      localStorage.setItem('caseStudySkills', JSON.stringify(skillsArray.value));
    }
  }

}
