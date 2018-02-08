import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {IProposal} from "../interfaces/proposal";

@Component({
  selector: 'proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.css']
})
export class ProposalDetailComponent implements OnInit, OnChanges {
  @Input() proposal?: IProposal;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(){
  }

}
