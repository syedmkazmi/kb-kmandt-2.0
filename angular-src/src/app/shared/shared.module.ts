import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageCropperModule} from "ngx-img-cropper";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
    FormsModule,
    RouterModule
  ],
  declarations: [],
  exports: [ImageCropperModule, FormsModule, RouterModule]
})
export class SharedModule {
}
