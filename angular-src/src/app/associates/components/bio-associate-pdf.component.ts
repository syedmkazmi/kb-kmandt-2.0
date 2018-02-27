import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication/services/authentication.service";
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BioService} from "../../bios/services/bio.service";
import {SharedService} from "../../root/services/shared.service";
import {NotificationsService} from "../../root/services/notifications.service";
import {ISector} from "../../root/interfaces/sector";
import {IIcon} from "../../root/interfaces/icon";
import {IUser} from "../../users/interfaces/user";
import {IBio} from "../../bios/interfaces/Bio";
import {ISkill} from "../../root/interfaces/skill";
import {ViewChild} from "@angular/core";
import {ImageCropperComponent, CropperSettings} from "ngx-img-cropper";
import UIkit from 'uikit'

@Component({
  selector: 'app-bio-associate-pdf',
  templateUrl: './bio-associate-pdf.component.html',
  styleUrls: ['./bio-associate-pdf.component.css']
})
export class BioAssociatePdfComponent implements OnInit {

  // COMPONENT VARIABLES
  title: String = "Associate Bio";
  userName: string;
  userImage: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  iconIndex: any;
  nativeWindow: any;
  downloadLink: string;
  //FORM GROUP
  bioAssociatePdfForm: FormGroup;

  //BOOLEAN VALUESe
  generatingPdf: boolean = false;
  addMoreExperience: boolean = false;
  downloadFile: boolean = false;

  //INTERFACES
  bio: IBio;
  skills: ISkill;
  sectors: ISector;
  icons: IIcon;
  user: IUser;

  // IMAGE CROPPER
  cropperSettings: CropperSettings;
  croppedImage: any;
  imageType: any;

  //UIKit
  UIkit: any;

  constructor(private _authService: AuthenticationService, private _bioService: BioService, private _router: Router, private _route: ActivatedRoute, private _fb: FormBuilder, private _notificationService: NotificationsService, private _ss: SharedService) { }

  ngOnInit() {
    this._authService.sendMessage(false);

    // Setting Up the fields for the Bio Edit Form
    this.bioAssociatePdfForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      region: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      bioForSector: ['', [Validators.required]],
      background: ['', [Validators.required, Validators.maxLength(1000)]],
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
  }

  // =======================================================
  // SAVE DATA FUNCTIONS           =========================
  // =======================================================

  pdf() {
    this.downloadFile = true;
    let p = Object.assign({}, this.bio, this.bioAssociatePdfForm.value);

    this._bioService.associatePdfBio(p)
      .subscribe((data) => {
          /*let parser = document.createElement('a');
          parser.href = data;
          parser.dispatchEvent(new MouseEvent('click'));*/
          this.downloadLink = data;
          this.generatingPdf = true;
          //this.downloadFile = false;
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

  // =======================================================
  // PRIVATE FUNCTIONS             =========================
  // =======================================================

  // Returns the passed in base64 strings mimeType (jpg/png)
  private _getImageMimeType(data) {
    if (data.charAt(0) == '/') {
      return "image/jpeg";
    } else if (data.charAt(0) == 'i') {
      return "image/png";
    }
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
      this.bioAssociatePdfForm.controls['iconOne'].setValue(url);
    } else if (this.iconIndex == "image2") {
      this.image2 = url;
      this.bioAssociatePdfForm.controls['iconTwo'].setValue(url);
    } else if (this.iconIndex == "image3") {
      this.image3 = url;
      this.bioAssociatePdfForm.controls['iconThree'].setValue(url);
    } else if (this.iconIndex == "image4") {
      this.image4 = url;
      this.bioAssociatePdfForm.controls['iconFour'].setValue(url);
    }
  }
  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.bioAssociatePdfForm.controls.skills;
    if (isChecked) {
      skillsArray.push(new FormControl(skill));
    } else {
      let index = skillsArray.controls.findIndex(x => x.value == skill);
      skillsArray.removeAt(index);
    }
  }
  // Show & Hide optional experience fields
  public addMoreExp() {
    this.addMoreExperience = !this.addMoreExperience;
  }

  // Set the image cropped by user (using the image cropper function) to the bioForm "photo" control
  public setBioImage(){
    this.bioAssociatePdfForm.controls['photo'].setValue(this.croppedImage.image);
    this.userImage = this.croppedImage.image
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
