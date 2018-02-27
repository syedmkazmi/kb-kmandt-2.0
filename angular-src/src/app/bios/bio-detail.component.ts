import { Component, OnInit, Input } from '@angular/core';
import {IBio} from "./interfaces/Bio";
import {BioService} from "./services/bio.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'bio-detail',
  templateUrl: './bio-detail.component.html',
  styleUrls: ['./bio-detail.component.css']
})
export class BioDetailComponent implements OnInit {
@Input() bio?: IBio;
downloadFile: boolean = false;

  constructor(private _bioService: BioService) { }

  ngOnInit() {
  }

  pdf(bio: IBio) {
    this.downloadFile = true;
    this._bioService.pdfBio(bio, bio._id)
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
            //this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        })
  }

}
