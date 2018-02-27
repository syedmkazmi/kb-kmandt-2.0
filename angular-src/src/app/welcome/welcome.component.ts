import {Component, OnInit} from '@angular/core';


@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  title: string = `Welcome to your
Dashboard`;

  constructor() {
  }

  ngOnInit() {
  }


}
