import { Component, OnInit } from '@angular/core';
import {HttpRequestService} from '../../core/services';
import {NzDrawerRef} from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-notification-drawer',
  templateUrl: './notification-drawer.component.html',
  styleUrls: ['./notification-drawer.component.scss']
})
export class NotificationDrawerComponent implements OnInit {
  notifications: any[] = [];
  loading = false;
  page = 1;
  haveMoreData = true;
  constructor(
    private httpRequestService: HttpRequestService,
    private drawerRef: NzDrawerRef<string>
  ) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(): void {
    this.loading = true;
    const limit = 10;
    const skip = (this.page - 1) * limit;
    this.httpRequestService.request('get', 'notifications', { skip, limit }).subscribe(
      (values) => {
        this.notifications = [ ...this.notifications, ...values.data];
        if (values.data.length < limit) {
          this.haveMoreData = false;
        }
        this.loading = false;
        this.page++;
      }
    );
  }

  close(): void {
    this.notifications = [];
    this.drawerRef.close();
  }

}
