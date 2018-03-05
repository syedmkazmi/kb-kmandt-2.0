import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IBio} from "../interfaces/Bio";
import {HttpErrorResponse} from "@angular/common/http";
import {BioService} from "../services/bio.service";

@Component({
  templateUrl: './bio-list.component.html',
  styleUrls: ['./bio-list.component.css']
})
export class BioListComponent implements OnInit {
  title: string = "Bio's";
  bios: IBio[];
  selectedBio: any;
  downloadFile: boolean = false;

  constructor(private _route: ActivatedRoute, private _bioService: BioService) {
  }

  ngOnInit() {
    // Get Bios from bios list route resolver service
    this._route.data.subscribe(
      data => {
        this.bios = data['bios'];
      }
    );
  }

  onSelect(bio) {
    this.selectedBio = bio;
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
