import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { etAdminMenu } from '../data/menu.data';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menu: Subject<any[]> = new Subject<any[]>();

  constructor() {}
  public generateMenu(userRole: string): void {
    this.menu.next(etAdminMenu);

    // if (userRole === 'admin') {
    //   this.menu.next(etAdminMenu);
    // }
  }
}
