import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {IUser} from "../interfaces/user";
import {ISector} from "../../root/interfaces/sector";
import {UserService} from "../services/user.service";
import {NotificationsService} from "../../root/services/notifications.service";
import {ViewChild} from "@angular/core";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";
import UIkit from 'uikit'
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  title: string = "Account Settings";
  userEditForm: FormGroup;
  user: IUser;
  sectors: ISector[];
  profileImage: string;
  data: any;
  cropperSettings: CropperSettings;
  imageType: string;
  UIkit: any;

  constructor(private _route: ActivatedRoute, private _fb: FormBuilder, private _router: Router, private _userService: UserService, private _notificationService: NotificationsService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.data = {};
  }

  ngOnInit() {

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
    this.data = {};

    /*this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 400;

    this.cropperSettings.minWidth = 200;
    this.cropperSettings.minHeight = 200;
    this.cropperSettings.compressRatio = 1.0;*/

    this.data = {};

    this.userEditForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      //photo: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      region: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      lineManagerEmail: ['', [Validators.required]]
    });

    // Get user from user edit route resolver service
    this._route.data.subscribe(
      data => {
        this.onUserRetrieved(data['user']);
      }
    );

    // Get all sectors from sector resolver service
    this._route.data.subscribe(
      data => {
        this.sectors = data['sector'];
      }
    );

    // Get users profile picture from local storage
    this.profileImage = localStorage.getItem("profile-img");
  }

  onUserRetrieved(user: IUser) {
    if (this.userEditForm) {
      this.userEditForm.reset();
    }

    if (user.photo != null) {
      this.imageType = this._getImageMimeType(user.photo);
    }

    this.user = user;

    this.userEditForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      jobTitle: this.user.jobTitle,
      //photo: this.user.photo,
      startDate: this.user.startDate,
      birthday: this.user.birthday,
      region: this.user.region,
      sector: this.user.sector,
      lineManagerEmail: this.user.lineManagerEmail
    });

  }

  save() {
    if (this.userEditForm.dirty && this.userEditForm.touched) {
      let p = Object.assign({}, this.user, this.userEditForm.value);
      let id = this._route.snapshot.paramMap.get('id');

      this._userService.update(p, id)
        .subscribe(
          () => {
            this._updateLocalStorage();
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
    } else if (!this.userEditForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.userEditForm.reset();
    this._router.navigate(['/']);
  }

  saveProfileImage() {
    localStorage.setItem("profile-img", this.data.image);
    this.profileImage = localStorage.getItem("profile-img");

    this._userService.sendMessage(this.profileImage);
  }

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;


  fileChangeListener($event) {
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

  // User Pictures are being saved in Local Storage
  /*setProfileImage() {

    let base64Image = this._stripBase64(this.data.image);
    let id = this._route.snapshot.paramMap.get('id');

    this._userService.setProfileImage(id, base64Image)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            //this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        })
  }*/


  private _getImageMimeType(data) {
    if (data.charAt(0) == '/') {
      return "image/jpeg";
    } else if (data.charAt(0) == 'i') {
      return "image/png";
    }
  }

  private _stripBase64(image) {
    return image.replace(/^data:image\/[a-z]+;base64,/, "");
  }

  private _updateLocalStorage() {
    let userInfo = {
      _id: JSON.parse(localStorage.getItem("userInfo"))._id,
      firstName: this.userEditForm.controls['firstName'].value,
      lastName: this.userEditForm.controls['lastName'].value
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

}
