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

  title: string = "Dashboard";
  proposals: IProposal[];
  bios: IBio[];
  userID: string;

  constructor(private _ds: DashboardService) {
  }

  ngOnInit() {
    this._getUserId();
    this.getProposals();
    this.getBios();
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

  private _getUserId() {
    this.userID = JSON.parse(localStorage.getItem("userInfo"))._id;
  }

}
