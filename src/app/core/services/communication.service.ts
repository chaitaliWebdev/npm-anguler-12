import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  authLogout: Subject<any> = new Subject<any>();
  profileChange: Subject<any> = new Subject<any>();
  constructor() { }

  public logout(): void{
    this.authLogout.next();
  }
}
