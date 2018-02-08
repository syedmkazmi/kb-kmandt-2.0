import {Component, OnInit} from '@angular/core';
import {CropperSettings} from 'ng2-img-cropper';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  title: string = `Welcome to your
Dashboard`;
  data: any;
  cropperSettings: CropperSettings;
  constructor() {
  }

  ngOnInit() {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 300;
    this.cropperSettings.height = 300;
    this.cropperSettings.croppedWidth = 600;
    this.cropperSettings.croppedHeight = 600;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.compressRatio = 10.0;

    this.data = {};
  }


}
