import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IBio} from "../interfaces/Bio";

@Component({
  templateUrl: './bio-list.component.html',
  styleUrls: ['./bio-list.component.css']
})
export class BioListComponent implements OnInit {
  title: string = "Bio's";
  bios: IBio[];

  constructor(private _route: ActivatedRoute) {
  }

  ngOnInit() {
    // Get Bios from bios list route resolver service
    this._route.data.subscribe(
      data => {
        this.bios = data['bios'];
        console.log(this.bios);
      }
    );
  }

}
