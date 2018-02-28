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
  userName: string;
  marketing: any;
  humanResources: any;
  clients: any;
  link: any;

  constructor(private _ds: DashboardService) {
  }

  ngOnInit() {
    this._getUserId();
    this._getUserName();
    this.getProposals();
    this.getBios();
    this.marketingFiles();
    this.humanResourcesFile();
    this.clientFiles();
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

  marketingFiles(){
    let file: any;
    this._ds.getMarketingFiles()
      .subscribe(
        (data) => {
          file = data;
          this.marketing = JSON.parse(file).entries;
        },
        (err) => {
          console.log(err);
        }
      )
  }
  humanResourcesFile(){
    let file: any;
    this._ds.getHumanResourceFiles()
      .subscribe(
        (data) => {
          file = data;
          this.humanResources = JSON.parse(file).entries;
        },
        (err) => {
          console.log(err);
        }
      )
  }
  clientFiles(){
    let file: any;

    this._ds.getClientFiles()
      .subscribe(
        (data) => {
          file = data;
          this.clients = JSON.parse(file).entries;
        },
        (err) => {
          console.log(err);
        }
      )
  }


  downloadFile(name){
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

  private _getUserName(){
    this.userName = JSON.parse(localStorage.getItem("userInfo")).firstName;
  }

}
