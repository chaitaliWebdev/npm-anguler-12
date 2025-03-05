import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { NotificationDrawerComponent } from '../../../shared/notification-drawer/notification-drawer.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;
  notificationSelectedClass = false;
  profileSelectedClass = false;
  selectedCommunity = '';
  showCommunity = false;
  student: any = {};
  studentInfo: any = {};
  mediaLocation: any = '';
  profilePicUrl: any = '';
  userInfo = [
    {
      title: 'My profile',
    },
    {
      title: 'Settings',
    },
    {
      title: 'Logout',
    },
  ];
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private localStorageService: LocalStorageService,
    private drawerService: NzDrawerService,
    private configurationService: ConfigurationService,
    private communicationService : CommunicationService
  ) {

  }

  ngOnInit(): void {
    //console.log('user', this.student);
    this.mediaLocation =  this.configurationService.mediaBaseUrl;
    this.student = this.localStorageService.getItem('student');
    // this.isCollapsed = window.innerWidth < 800;
    this.getProfileInfo();
    this.communicationService.profileChange.subscribe(result=>{
      if(result){
        this.getProfileInfo();
      }
    })
  }

  getProfileInfo(): void {
    this.httpRequestService
      .request('get', `auth-students/profile`)
      .subscribe(
        (result: any) => {
          this.studentInfo = result.data;
          if(this.studentInfo.profilePicture?.path){
              this.profilePicUrl = this.mediaLocation + this.studentInfo.profilePicture?.path
          }
          else{
            this.profilePicUrl = ''
          }
        },
        (error: any) => {}
      );
  }





  onChangeCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsed.emit(this.isCollapsed);
  }


  logout(): void {
    this.httpRequestService
      .request('delete', 'auth-students/logout')
      .subscribe((success) => {
        this.notificationService.success(
          'Success',
          'You Successfully Logged out'
        );
      });
    this.authService.logout();
  }

  openNotificationComponent(): void {
    const drawerRef = this.drawerService.create<
      NotificationDrawerComponent,
      { value: null },
      string
    >({
      nzTitle: 'Notifications',
      nzContent: NotificationDrawerComponent,
      nzWidth: 350,
      nzContentParams: {
        value: null,
      },
    });

    drawerRef.afterOpen.subscribe(() => {});

    drawerRef.afterClose.subscribe((data) => {});
  }
}
