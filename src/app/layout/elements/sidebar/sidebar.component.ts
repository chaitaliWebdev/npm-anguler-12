import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AuthService,
  HttpRequestService,
  LocalStorageService,
  MenuService,
} from '../../../core/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuData: any[] = [];
  currentRoute = '';
  @Input() isCollapsed = true;
  menuChildren: Subject<any[]> = new Subject<any[]>();
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
    private httpRequestService: HttpRequestService,
    private localStorageService: LocalStorageService
  ) {
    this.menuService.menu.subscribe((menudata) => {
      this.menuData = menudata;
      // console.log('menudata', this.menuData);
      this.menuData.forEach((menu) => {
        menu.isOpen = this.currentRoute.includes(menu.route);
      });
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    //  console.log('currentRoute', this.currentRoute);
    this.authService.authState.subscribe((status) => {
    });
    const userRole = this.localStorageService.getItem('user').role;
    this.menuService.generateMenu(userRole);
  }
}
