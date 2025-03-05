import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CommunicationService } from './communication.service';
import { HttpRequestService } from './http-request.service';
// import { promise } from 'protractor';
interface AuthState {
  authenticated: boolean;
  student: null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticationState: ReplaySubject<AuthState> = new ReplaySubject<AuthState>(
    1
  );
  constructor(
    private localStorageService: LocalStorageService,
    private httpRequestService: HttpRequestService,
    private communicationService: CommunicationService
  ) {
    /**
     * logout call by subject
     */
    this.communicationService.authLogout.subscribe((success) => {
      this.logout();
    });

    /**
     * Check Logged in Logic
     */
    const student = localStorageService.getItem('student');
    const token = localStorageService.getItem('token', false);
    // const expiry = localStorageService.getItem('expiry');
    const authenticated = !!student && !!token;
    this.authenticationState.next({ authenticated, student: student || null });
  }
  public get authState(): Observable<AuthState> {
    return this.authenticationState as Observable<AuthState>;
  }
  public getLocalUser(): any {
    return this.localStorageService.getItem('student');
  }
  public setLocalUser(student: any): void {
    this.localStorageService.setItem('student', student);
    this.authenticationState.next({ authenticated: true, student });
  }
  private setLocalToken(token: string): void {
    this.localStorageService.setItem('token', token);
  }
  public async login(phone: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService
        .request('post', 'auth-students/login', { phone, password })
        .subscribe(
          (success) => {
            const loginResponse = success.data;
            this.setLocalUser(loginResponse.student);
            this.setLocalToken(loginResponse.token);
            resolve(loginResponse.student);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  public async logout(): Promise<any> {
    /**
     * Replace with API Call
     */
    return new Promise<void>((resolve, reject) => {
      this.localStorageService.removeItem('student');
      this.localStorageService.removeItem('token');
      this.authenticationState.next({ authenticated: false, student: null });
      resolve();
    });
  }
}
