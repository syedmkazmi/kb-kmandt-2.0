import { Component, OnInit } from '@angular/core';
import {IProposal} from "../../proposals/interfaces/proposal";
import {DashboardService} from "../services/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  title: string = "Dashboard";
  proposals: IProposal[];
  userID: string;

  constructor(private _ds: DashboardService) { }

  ngOnInit() {
    this._getUserId();
    this.getProposals();
  }

  getProposals(){
    this._ds.getAll(this.userID)
      .subscribe(
        (data) => {
          this.proposals = data;
        },
      (err) => {
          console.log(err);
      })
  }

  private _getUserId() {
    this.userID = JSON.parse(localStorage.getItem("userInfo"))._id;
  }

}
