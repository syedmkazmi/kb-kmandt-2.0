import { Component, OnInit } from '@angular/core';
import {IProposal} from "../../proposals/interfaces/proposal";
import {DashboardService} from "../services/dashboard.service";
import {IBio} from "../../bios/interfaces/Bio";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  title: string = "Welcome to your Dashboard";
  proposals: IProposal[];
  bios: IBio[];
  userID: string;
  files: any;
  file: any;
  link: any;

  constructor(private _ds: DashboardService) {
  }

  ngOnInit() {
    this._getUserId();
    this.getProposals();
    this.getBios();
    this.getFiles();
  }

  getProposals(){
    this._ds.getProposals(this.userID)
      .subscribe(
        (data) => {
          this.proposals = data;
        },
      (err) => {
          console.log(err);
      })
  } //TODO: Add proper error handling here

  getBios(){
    this._ds.getBios(this.userID)
      .subscribe(
        (data) => {
          this.bios = data;
        },
        (err) => {
          console.log(err);
        }
      )
  }

  getFiles(){
    this._ds.getMarketingFiles()
      .subscribe(
        (data) => {
         // console.log(data);
          this.file = data;
          this.files = JSON.parse(this.file).entries;
         // console.log(JSON.parse(this.file).entries.name);
          //console.log(JSON.parse(this.files)[0]);
          //console.log(JSON.parse(JSON.stringify(this.files))["entries"]);
          //console.log(JSON.parse(JSON.stringify(this.files[0].name)));

        },
        (err) => {
          console.log(err);
        }
      )
  }

  getFilesUrl(name){
    this._ds.downloadFile(name)
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

  private _getUserId() {
    this.userID = JSON.parse(localStorage.getItem("userInfo"))._id;
  }

}
