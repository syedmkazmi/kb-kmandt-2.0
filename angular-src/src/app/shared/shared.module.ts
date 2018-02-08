import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageCropperModule} from "ng2-img-cropper";

@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
  ],
  declarations: [],
  exports: [ImageCropperModule]
})
export class SharedModule {
}
