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
import {SharedService} from "../../root/services/shared.service";
// =======================================================
// INTERFACES IMPORTS            =========================
// =======================================================
import {IBio} from "../interfaces/Bio";
import {ISector} from "../../root/interfaces/sector";
import {ISkill} from "../../root/interfaces/skill";
import {IIcon} from "../../root/interfaces/icon";
import {IUser} from "../../users/interfaces/user";

@Component({
  templateUrl: './bio-pdf.component.html',
  styleUrls: ['./bio-pdf.component.css']
})
export class BioPdfComponent implements OnInit {
  // COMPONENT VARIABLES
  title: String = "Generate Bio";
  userName: string;
  userImage: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  iconIndex: any;
  addMoreExperience: boolean = false;
  downloadFile: boolean = false;
  nativeWindow: any;

  //FORM GROUP
  bioPdfForm: FormGroup;
  generatingPdf: string = "Processing your file....";

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


  constructor(private _bioService: BioService, private _router: Router, private _route: ActivatedRoute, private _fb: FormBuilder, private _notificationService: NotificationsService, private _ss: SharedService) {
    this.nativeWindow = this._ss.getWindowRef();
  }

  ngOnInit() {

    // Setting Up the fields for the Bio Edit Form
    this.bioPdfForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      region: ['', [Validators.required]],
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
    if (this.bioPdfForm) {
      this.bioPdfForm.reset();
    }
    // Set retrieved bio to the local "this.bio" variable.
    this.bio = bio;

    // Access icons from the retrieved bio and assign them local variable to be displayed on front-end.
    this.image1 = this.bio.iconOne;
    this.image2 = this.bio.iconTwo;
    this.image3 = this.bio.iconThree;
    this.image4 = this.bio.iconFour;

    // If the retrieved bio contains a photo
    if (this.bio.photo) {
      this.imageType = this._getImageMimeType(this.bio.photo);
      this.bio.photo = `data:${this.imageType};base64,${this.bio.photo}`;
      this.userImage = this.bio.photo;

      console.log(this.userImage);
    }

    // Use "patchValue" method to assign values to reactive form controls so they can be edited.
    this.bioPdfForm.patchValue({
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

    // Set the values for the reactive form control titled "skills"
    this.bioPdfForm.setControl('skills', this._fb.array(this.bio.skills || []));
    // Use "patchValue" to set the values for the reactive form control titled "experience"
    this.bioPdfForm.controls['experience'].patchValue({
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

  pdf() {
    this.downloadFile = true;
    let p = Object.assign({}, this.bio, this.bioPdfForm.value);
    let id = this._route.snapshot.paramMap.get('id');

    this._bioService.pdfBio(p, id)
      .subscribe((data) => {
          let parser = document.createElement('a');
          parser.href = data;
          parser.dispatchEvent(new MouseEvent('click'));
          this.downloadFile = false;
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

  onSaveComplete(): void {
    this.bioPdfForm.reset();
    this._router.navigate(['/dashboard']);
  }

  // =======================================================
  // PRIVATE FUNCTIONS             =========================
  // =======================================================

  // Gets users name from browser local storage & assigns the name to local variable on component initialisation
  private _setUserName() {
    this.userName = JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName;
  }

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
      this.bioPdfForm.controls['iconOne'].setValue(url);
    } else if (this.iconIndex == "image2") {
      this.image2 = url;
      this.bioPdfForm.controls['iconTwo'].setValue(url);
    } else if (this.iconIndex == "image3") {
      this.image3 = url;
      this.bioPdfForm.controls['iconThree'].setValue(url);
    } else if (this.iconIndex == "image4") {
      this.image4 = url;
      this.bioPdfForm.controls['iconFour'].setValue(url);
    }
  }
  // Create a "Form Array" to save skills array in reactive bioForm. If skill is checked add to Form Array and if unchecked then remove
  public skillsOnChange(skill: string, isChecked: boolean) {
    const skillsArray = <FormArray>this.bioPdfForm.controls.skills;
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
    this.bioPdfForm.controls['photo'].setValue(this.croppedImage.image);
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

