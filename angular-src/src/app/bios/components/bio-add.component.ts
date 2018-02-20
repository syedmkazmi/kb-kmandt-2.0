// =======================================================
// INTERNAL ANGULAR IMPORTS      =========================
// =======================================================
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
// =======================================================
// OTHER IMPORTS                 =========================
// =======================================================
import {ViewChild} from "@angular/core";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";
import UIkit from 'uikit'
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
import {IUser} from "../../users/interfaces/user";

@Component({
  selector: 'bio-add',
  templateUrl: './bio-add.component.html',
  styleUrls: ['./bio-add.component.css']
})
export class BioAddComponent implements OnInit {
  // COMPONENT VARIABLES
  title: String = "Create Bio";
  userName: string;
  userImage: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  iconIndex: any;
  addMoreExperience: boolean = false;

  //FORM GROUP
  bioForm: FormGroup;

  //INTERFACES
  bio: IBio;
  skills: ISkill;
  sectors: ISector;
  icons: IIcon;
  user: IUser;

  // IMAGE CROPPER
  cropperSettings: CropperSettings;
  croppedImage: any;

  //UIKit
  UIkit: any;

  constructor(private _fb: FormBuilder, private  _router: Router, private _route: ActivatedRoute, private _bioService: BioService, private _notificationService: NotificationsService) {
  }

  ngOnInit() {

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

    // Get the User Details from Bio User resolver service
    this._route.parent.data.subscribe(data => {
      this.user = data['user'];
    });
    // Setting Up the fields for the Bio Add Form
    this.bioForm = this._fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      jobTitle: [this.user.jobTitle, [Validators.required]],
      region: [this.user.region, [Validators.required]],
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
    this._checkLocalStorage();

    // Image Cropper Settings
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 400;

    this.cropperSettings.minWidth = 200;
    this.cropperSettings.minHeight = 200;
    this.cropperSettings.compressRatio = 1.0;
    this.croppedImage = {};
  }

  // =======================================================
  // SAVE DATA FUNCTIONS           =========================
  // =======================================================

  // Send bioForm data to bio service to be handle & redirect on success and show error on failure
  save() {
    if (this.bioForm.dirty && this.bioForm.touched) {
      let p = Object.assign({}, this.bio, this.bioForm.value);

      this._bioService.addBio(p)
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
    } else if (!this.bioForm.dirty) {
      this.onSaveComplete();
    }
  }
  onSaveComplete(): void {
    this.bioForm.reset();
    this._router.navigate(['/dashboard']);
  }

  // =======================================================
  // PRIVATE FUNCTIONS             =========================
  // =======================================================

  // Gets users name & profile image (if exists) from browser local storage & assigns the profile picture to the bioForm "photo" control on
  // component initialisation
  private _setUserName() {
    this.userName = JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName;
    this.userImage = localStorage.getItem("profile-img");

    if (this.userImage != null) {
      this.bioForm.controls['photo'].setValue(this._stripBase64(this.userImage));
    }
  }
  // Removes the "data:image.." from the base64 image string generated by the image cropper function
  private _stripBase64(image) {
    return image.replace(/^data:image\/[a-z]+;base64,/, "");
  }

  private _checkLocalStorage() {
    let localStorage_experience = JSON.parse(localStorage.getItem("experience"));
    let localStorage_skills = JSON.parse(localStorage.getItem("skills"));

    this.bioForm.controls["background"].setValue(localStorage.getItem("background") || "");
    this.bioForm.setControl('experience', this._fb.group(localStorage_experience || {"field0": "","field1": "","field2": "","field3": "","field4": "","field5": ""}));
    this.bioForm.setControl('skills', this._fb.array(localStorage_skills || []));
  }

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
      this.bioForm.controls['iconOne'].setValue(url);
    } else if (this.iconIndex == "image2") {
      this.image2 = url;
      this.bioForm.controls['iconTwo'].setValue(url);
    } else if (this.iconIndex == "image3") {
      this.image3 = url;
      this.bioForm.controls['iconThree'].setValue(url);
    } else if (this.iconIndex == "image4") {
      this.image4 = url;
      this.bioForm.controls['iconFour'].setValue(url);
    }
  }
  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.bioForm.controls.skills;
    if (isChecked) {
      skillsArray.push(new FormControl(skill));
      localStorage.setItem('skills', JSON.stringify(skillsArray.value));
    } else {
      let index = skillsArray.controls.findIndex(x => x.value == skill);
      skillsArray.removeAt(index);
      localStorage.setItem('skills', JSON.stringify(skillsArray.value));
    }
  }
  // Show & Hide optional experience fields
  public addMoreExp() {
    this.addMoreExperience = !this.addMoreExperience;
  }
  // Set the image cropped by user (using the image cropper function) to the bioForm "photo" control
  public setBioImage() {
    this.bioForm.controls['photo'].setValue(this._stripBase64(this.croppedImage.image));
    this.userImage = this.croppedImage.image;
  }

  public autoSave(){
    const skillsArray = <FormArray>this.bioForm.controls.skills.value;
    console.log(skillsArray);
    localStorage.setItem('background', this.bioForm.controls['background'].value);
    localStorage.setItem('experience', JSON.stringify(this.bioForm.controls['experience'].value));
    //localStorage.setItem('skills', JSON.stringify(skillsArray));

  }

  // =======================================================
  // IMAGE CROPPER FUNCTION        =========================
  // =======================================================
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  imageCropperListener($event) {
    UIkit.modal('#modal-container').show();

    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      setTimeout(() => {
        that.cropper.setImage(image);
      }, 0);
    };

    myReader.readAsDataURL(file);
  }
}
