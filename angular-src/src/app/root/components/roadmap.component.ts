import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication/services/authentication.service";

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css']
})
export class RoadmapComponent implements OnInit {

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    this._authService.sendMessage(false);
  }

}
