import { Component, OnInit, Input } from '@angular/core';
import {IProposal} from "../proposals/interfaces/proposal";


@Component({
  selector: 'proposal-dashboard',
  templateUrl: './proposal-dashboard.component.html',
  styleUrls: ['./proposal-dashboard.component.css', '../proposals/components/proposal-list.component.css']
})
export class ProposalDashboardComponent implements OnInit {
  title: string = "Your Proposals";
  @Input() proposals: IProposal[];
  _listFilter: string;
  selectedProposal: IProposal;

  constructor() { }

  ngOnInit() {
  }

  onSelect(proposal: IProposal) {
    this.selectedProposal = JSON.parse(JSON.stringify(proposal));
  }

}
