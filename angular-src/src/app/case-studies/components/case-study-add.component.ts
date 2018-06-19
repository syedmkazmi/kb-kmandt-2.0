// =======================================================
// INTERNAL ANGULAR IMPORTS      =========================
// =======================================================
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";

// =======================================================
// INTERFACES IMPORTS            =========================
// =======================================================
import {ICasestudy} from "../interfaces/casestudy";
import {ISector} from "../../root/interfaces/sector";
import {IUser} from "../../users/interfaces/user";

// =======================================================
// SERVICE IMPORTS               =========================
// =======================================================
import {NotificationsService} from "../../root/services/notifications.service";
import {CaseStudyService} from "../services/case-study.service";
import {ISkill} from "../../root/interfaces/skill";

@Component({
  selector: 'case-study-add',
  templateUrl: './case-study-add.component.html',
  styleUrls: ['./case-study-add.component.css']
})
export class CaseStudyAddComponent implements OnInit {

  // COMPONENT VARIABLES
  title: String = "Create Case Study";
  newClient: Boolean;
  userID: any;

  //FORM GROUP
  caseStudyForm: FormGroup;

  //INTERFACES
  caseStudy: ICasestudy;
  sectors: ISector;
  user: IUser;
  skills: ISkill;


  constructor(private _fb: FormBuilder, private  _router: Router, private _route: ActivatedRoute, private _notificationService: NotificationsService, private _caseStudyService: CaseStudyService) { }

  ngOnInit() {

    // Get all sector from user sector resolver service
    this._route.data.subscribe(data => {
      this.sectors = data['sector']
    });

    // Get the User Details from Case Study User resolver service
    this._route.parent.data.subscribe(data => {
      this.user = data['user'];
    });

    // Get the Skills List from Skills List resolver service
    this._route.parent.data.subscribe(data => {
      this.skills = data['skill'];
    });
    // Get the logged in users ID from the local storage
    this.userID = this._getUserID();

    // Setting Up the fields for the Case Study Add Form
    this.caseStudyForm = this._fb.group({
        firstName: [this.user.firstName, [Validators.required]],
        lastName: [this.user.lastName, [Validators.required]],
        region: [this.user.region, [Validators.required]],
        sector: ['', [Validators.required]],
        lineManagerEmail: [this.user.lineManagerEmail, [Validators.required]],
        title: ['', [Validators.required]],
        proposalNo: [''],
        client: ['', [Validators.required]],
        background: ['', [Validators.required]],
        businessCase: ['', [Validators.required]],
        approach: ['', [Validators.required]],
        results: ['', [Validators.required]],
        userID: [this.userID, [Validators.required]],
        skills: this._fb.array([], Validators.required),
      });

    this._checkLocalStorage();
  }

  // =======================================================
  // SAVE NEW CASE STUDY           =========================
  // =======================================================
  save() {

    if (this.caseStudyForm.dirty && this.caseStudyForm.touched) {
      let p = Object.assign({}, this.caseStudy, this.caseStudyForm.value);

      this._caseStudyService.create(p)
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
    } else if (!this.caseStudyForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.caseStudyForm.reset();
    this._router.navigate(['/casestudies']);
  }


  public addNewClient() {
    this.newClient = !this.newClient;
  }

  // Private Methods
  private _getUserID() {
    return JSON.parse(localStorage.getItem("userInfo"))._id;
  }
  private _checkLocalStorage() {
    this.caseStudyForm.controls["proposalNo"].setValue(localStorage.getItem("proposalNo") || "");
    this.caseStudyForm.controls["client"].setValue(localStorage.getItem("client") || "");
    this.caseStudyForm.controls["sector"].setValue(localStorage.getItem("sector") || "");
    this.caseStudyForm.controls["title"].setValue(localStorage.getItem("title") || "");
    this.caseStudyForm.controls["background"].setValue(localStorage.getItem("caseStudybackground") || "");
    this.caseStudyForm.controls["businessCase"].setValue(localStorage.getItem("businessCase") || "");
    this.caseStudyForm.controls["approach"].setValue(localStorage.getItem("approach") || "");
    this.caseStudyForm.controls["results"].setValue(localStorage.getItem("results") || "");

    if (localStorage.getItem("caseStudySkills")) {
      let localStorage_skills = JSON.parse(localStorage.getItem("caseStudySkills"));
      this.caseStudyForm.setControl('skills', this._fb.array(localStorage_skills || []));
    }
  }

  // Public Methods
  // Auto save user entries into local storage.
  public autoSave() {
    localStorage.setItem('proposalNo', this.caseStudyForm.controls['proposalNo'].value);
    localStorage.setItem('client', this.caseStudyForm.controls['client'].value);
    localStorage.setItem('sector', this.caseStudyForm.controls['sector'].value);
    localStorage.setItem('title', this.caseStudyForm.controls['title'].value);
    localStorage.setItem('caseStudybackground', this.caseStudyForm.controls['background'].value);
    localStorage.setItem('businessCase', this.caseStudyForm.controls['businessCase'].value);
    localStorage.setItem('approach', this.caseStudyForm.controls['approach'].value);
    localStorage.setItem('results', this.caseStudyForm.controls['results'].value);
  }

  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.caseStudyForm.controls.skills;
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
