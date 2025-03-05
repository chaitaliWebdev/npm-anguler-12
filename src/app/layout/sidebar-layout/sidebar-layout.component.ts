import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss'],
})
export class SidebarLayoutComponent implements OnInit {
  isCollapsed = false;
  conWidth: any;
  colWidth: any;

  constructor() {}

  ngOnInit(): void {
   this.conWidth = !this.isCollapsed ? '0px' : '280px';
   this.colWidth = !this.isCollapsed ? '280' : '0';
  }
  onCollapseChange(value: any): void {
    this.isCollapsed = value;
  }
}
