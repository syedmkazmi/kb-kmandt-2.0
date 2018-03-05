// =======================================================
// INTERNAL ANGULAR IMPORTS      =========================
// =======================================================
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
// =======================================================
// SERVICE IMPORTS               =========================
// =======================================================
import {NotificationsService} from "../../root/services/notifications.service";
import {BioService} from "../services/bio.service";
// =======================================================
// INTERFACES IMPORTS            =========================
// =======================================================
import {IBio} from "../interfaces/Bio";
import {ISector} from "../../root/interfaces/sector";
import {ISkill} from "../../root/interfaces/skill";
import {IIcon} from "../../root/interfaces/icon";

@Component({
  templateUrl: './bio-edit.component.html',
  styleUrls: ['./bio-edit.component.css']
})
export class BioEditComponent implements OnInit {
  // COMPONENT VARIABLES
  title: String = "Edit Bio";
  userName: string;
  userImage: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  iconIndex: any;
  addMoreExperience: boolean = false;

  //FORM GROUP
  bioEditForm: FormGroup;

  //INTERFACES
  bio: IBio;
  skills: ISkill;
  sectors: ISector;
  icons: IIcon;

  //BOOLEAN VALUES
  buttonLoading: boolean = false;

  //UIKit
  UIkit: any;


  constructor(private _bioService: BioService, private _router: Router, private _route: ActivatedRoute, private _fb: FormBuilder, private _notificationService: NotificationsService) {
  }

  ngOnInit() {

    // Setting Up the fields for the Bio Edit Form
    this.bioEditForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      region: [{value:'', disabled: true}, [Validators.required]],
      photo: ['', [Validators.required]],
      bioForSector: ['', [Validators.required]],
      background: ['', [Validators.required, Validators.maxLength(1500)]],
      experience: this._fb.group({
        field0: ['', [Validators.required, Validators.maxLength(500)]],
        field1: ['', [Validators.required, Validators.maxLength(500)]],
        field2: ['', [Validators.required, Validators.maxLength(500)]],
        field3: ['', [Validators.required, Validators.maxLength(500)]],
        field4: ['', [Validators.maxLength(500)]],
        field5: ['', [Validators.maxLength(500)]]
      }),
      skills: this._fb.array([], Validators.required),
      iconOne: ['', [Validators.required]],
      iconTwo: ['', [Validators.required]],
      iconThree: ['', [Validators.required]],
      iconFour: ['', [Validators.required]]
    });

    this._setUserName();

    // Get all skills from skills resolver service
    this._route.data.subscribe(data => {
      this.skills = data['skill']
    });
    // Get all sector from user sector resolver service
    this._route.data.subscribe(data => {
      this.sectors = data['sector']
    });
    // Get all icons from icon resolver service
    this._route.parent.data.subscribe(data => {
      this.icons = data['icon']
    });
    // Get bio from the bio edit resolver service
    this._route.data.subscribe(data => {
      this.onBioRetrieved(data['bio']);
    });
  }

  // =======================================================
  // BIO RETRIEVED FUNCTION        =========================
  // =======================================================

  // Bio to be edited is retrieved and we use PatchValue to set reactive form controls values
  onBioRetrieved(bio): void {
    if (this.bioEditForm) {
      this.bioEditForm.reset();
    }
    // Set retrieved bio to the local "this.bio" variable.
    this.bio = bio;

    // Access icons from the retrieved bio and assign them local variable to be displayed on front-end.
    this.image1 = this.bio.iconOne;
    this.image2 = this.bio.iconTwo;
    this.image3 = this.bio.iconThree;
    this.image4 = this.bio.iconFour;

    // Use "patchValue" method to assign values to reactive form controls so they can be edited.
    this.bioEditForm.patchValue({
      firstName: this.bio.firstName,
      lastName: this.bio.lastName,
      jobTitle: this.bio.jobTitle,
      region: this.bio.region,
      photo: this.bio.photo || "",
      bioForSector: this.bio.bioForSector,
      background: this.bio.background,
      iconOne: this.bio.iconOne,
      iconTwo: this.bio.iconTwo,
      iconThree: this.bio.iconThree,
      iconFour: this.bio.iconFour
    });

    // If the retrieved bio contains a photo then ... (read comments below)
    if (this.bio.photo) {
      // then get the mimeType (png/jpg) from the retrieved base64 image
      //this.imageType = this._getImageMimeType(this.bio.photo);
      // then set the base64 image to the local variable to be displayed on front-end
      this.userImage = this.bio.photo;
    }

    // Set the values for the reactive form control titled "skills"
    this.bioEditForm.setControl('skills', this._fb.array(this.bio.skills || []));
    // Use "patchValue" to set the values for the reactive form control titled "experience"
    this.bioEditForm.controls['experience'].patchValue({
      field0: this.bio.experience['field0'],
      field1: this.bio.experience['field1'],
      field2: this.bio.experience['field2'],
      field3: this.bio.experience['field3'],
      field4: this.bio.experience['field4'],
      field5: this.bio.experience['field5']
    });

  }

  // =======================================================
  // SAVE DATA FUNCTIONS           =========================
  // =======================================================

  // Send bioEditForm data to bio service to be handle & redirect on success and show error on failure
  save() {
    this.buttonLoading = true;

    if (this.bioEditForm.dirty && this.bioEditForm.touched) {
      let p = Object.assign({}, this.bio, this.bioEditForm.value);
      let id = this._route.snapshot.paramMap.get('id');

      this._bioService.editBio(p, id)
        .subscribe(
          () => {
            this.buttonLoading = false;
            this.onSaveComplete()
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
    } else if (!this.bioEditForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.bioEditForm.reset();
    this._router.navigate(['/bios']);
  }

  // =======================================================
  // PRIVATE FUNCTIONS             =========================
  // =======================================================

  // Gets users name from browser local storage & assigns the name to local variable on component initialisation
  private _setUserName() {
    this.userName = JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName;
  }
  // Make Bio Pdf Form Dirty & Touched
  private _changeFormState(){
    this.bioEditForm.markAsTouched();
    this.bioEditForm.markAsDirty();
  };

  // =======================================================
  // PUBLIC FUNCTIONS              =========================
  // =======================================================

  // Gets the img tags id for which the user is trying to set an icon for
  public getBioIconElementId(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    this.iconIndex = idAttr.nodeValue;
  }
  // Check the img tag id set by "getBioIconElementId" function and set an icon for that img tag
  public setBioIcon(url) {
    if (this.iconIndex == "image1") {
      this.image1 = url;
      this.bioEditForm.controls['iconOne'].setValue(url);
      this._changeFormState();
    } else if (this.iconIndex == "image2") {
      this.image2 = url;
      this.bioEditForm.controls['iconTwo'].setValue(url);
      this._changeFormState();
    } else if (this.iconIndex == "image3") {
      this.image3 = url;
      this.bioEditForm.controls['iconThree'].setValue(url);
      this._changeFormState();
    } else if (this.iconIndex == "image4") {
      this.image4 = url;
      this.bioEditForm.controls['iconFour'].setValue(url);
      this._changeFormState();
    }
  }
  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.bioEditForm.controls.skills;
    if (isChecked) {
      skillsArray.push(new FormControl(skill));
      this._changeFormState();
    } else {
      let index = skillsArray.controls.findIndex(x => x.value == skill);
      skillsArray.removeAt(index);
      this._changeFormState();
    }
  }
  // Show & Hide optional experience fields
  public addMoreExp() {
    this.addMoreExperience = !this.addMoreExperience;
  }


}

