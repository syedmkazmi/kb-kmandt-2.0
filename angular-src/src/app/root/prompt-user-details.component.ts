import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt-user-details',
  templateUrl: './prompt-user-details.component.html',
  styleUrls: ['./prompt-user-details.component.css']
})
export class PromptUserDetailsComponent implements OnInit {
  id: any;
  constructor() { }

  ngOnInit() {
    this.id = JSON.parse(localStorage.getItem("userInfo"))._id;
  }

}
