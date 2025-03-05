import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  submitLoginForm(): void {
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm);
    } else {
      this.isLoading = true;
      this.authService
        .login(this.loginForm.value.phone, this.loginForm.value.password)
        .then((success) => {
          this.notificationService.success('Success', 'Successfully Logged In');
          this.isLoading = false;

        })
        .catch((error) => {
          this.notificationService.error('Error', error.error.message);
          this.isLoading = false;
        });
    }
  }
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
