import { Component, OnInit } from '@angular/core';
import {NotificationsService} from "../services/notifications.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  subscription: Subscription;
  notification: string;

  constructor(private _notificationService: NotificationsService) { }

  ngOnInit() {
    this.subscription = this._notificationService.getNotfication().subscribe(message => { this.notification = message; });
  }

}
