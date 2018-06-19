import { Component, OnInit } from '@angular/core';
import {CaseStudyService} from "../services/case-study.service";
import {ICasestudy} from "../interfaces/casestudy";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "../../root/services/notifications.service";
import {ActivatedRoute} from "@angular/router";
import {ISector} from "../../root/interfaces/sector";
import {ISkill} from "../../root/interfaces/skill";

@Component({
  selector: 'case-study-list',
  templateUrl: './case-study-list.component.html',
  styleUrls: ['./case-study-list.component.css']
})
export class CaseStudyListComponent implements OnInit {

  caseStudies: any;
  caseStudiesPending: any;
  link: any;
  _listFilter: String;
  selectedCaseStudy: ICasestudy;
  filterStatus: Boolean = true;
  filterMessage: string;
  sectors: ISector;
  queryParam: any = {};
  skills: ISkill;

  constructor(private _cs: CaseStudyService, private _notificationService: NotificationsService, private _route: ActivatedRoute) { }

  ngOnInit() {

    // Get all sector from user sector resolver service
    this._route.data.subscribe(data => {
      this.sectors = data['sector']
    });

    this._route.data.subscribe(data => {
        this.caseStudies = data['casestudies'];
      });

    this._route.data.subscribe(data => {
      this.skills = data['skill']
    });
  }

  get() {
    this.filterStatus = true;
    this._cs.get()
      .subscribe(
        (data) => {
          this.queryParam = {};
          this.caseStudies = data;
        }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
        console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
      }
    })
  }

  getPending() {
    this.filterStatus = true;
    this._cs.getPending()
      .subscribe(
        (data) => {
          this.queryParam = {};
          this.caseStudiesPending = data;
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this._notificationService.sendNotification(err.error.message); //TODO Does not show server 500 error.
            console.log(`Backend returned code ${err.status}, body was: ${err.error.message}`);
          }
        })
  }

  filterCaseStudies() {
    this._cs.getFiltered(this.queryParam)
      .subscribe(data => {
          if (data.length === 0) {
            this.filterStatus = false;
            this.filterMessage = "Your criteria did not match any data.";
          } else if (data.length >= 1) {
            this.filterStatus = true;
            this.caseStudies = data;
          }
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

  /*caseStudyFiles(){
    let file: any;
    this._cs.getCaseStudyFiles()
      .subscribe(
        (data) => {
          file = data;
          this.caseStudies = JSON.parse(file).entries;
        },
        (err) => {
          console.log(err);
        }
      )
  }*/

  downloadFile(name){
    this._cs.downloadFile(name)
      .subscribe(
        (data) => {
          this.link =  data;
          console.log(JSON.parse(this.link).link);

          window.open(JSON.parse(this.link).link);
        },
        (err) => {
          console.log(err);
        }
      )
  }

}
