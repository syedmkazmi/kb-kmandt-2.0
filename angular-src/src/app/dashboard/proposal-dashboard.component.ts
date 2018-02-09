import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {IProposal} from "../proposals/interfaces/proposal";


@Component({
  selector: 'proposal-dashboard',
  templateUrl: './proposal-dashboard.component.html',
  styleUrls: ['./proposal-dashboard.component.css', '../proposals/components/proposal-list.component.css']
})
export class ProposalDashboardComponent implements OnInit {
  title: string = "Proposals";
  @Input() proposals: IProposal[];
  selectedProposal: IProposal;
  show: number = 5;

  constructor() {
  }

  ngOnInit() {
  }

  onSelect(proposal: IProposal) {
    this.selectedProposal = JSON.parse(JSON.stringify(proposal));
  }

  loadMore() {
    this.show += 5;
  }

}
