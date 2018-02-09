import {Component, Input, OnInit} from '@angular/core';
import {IBio} from "../bios/interfaces/Bio";

@Component({
  selector: 'bio-dashboard',
  templateUrl: './bio-dashboard.component.html',
  styleUrls: ['./bio-dashboard.component.css', '../bios/components/bio-list.component.css']
})
export class BioDashboardComponent implements OnInit {

  title: string = "Bios";
  @Input() bios : IBio[];
  show: number = 5;

  constructor() { }

  ngOnInit() {
  }

  loadMore() {
    this.show += 5;
  }
}
