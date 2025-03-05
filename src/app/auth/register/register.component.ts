import { Component, Input, OnInit, OnChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnChanges {
  registrationCompleteForm: FormGroup;
  isLoading = false;
  viewPassword = false;
  viewReEnterPassword = false;
  @Input() phone: any;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.registrationCompleteForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [null, Validators.required],
      reEnterPassword: [
        null,
        [Validators.required, this.confirmationValidator],
      ],
      isVerified: [true],
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.registrationCompleteForm.controls.reEnterPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.registrationCompleteForm.controls.password.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  }

  ngOnInit(): void {}

  ngOnChanges(...args: any[]): void {
    if (args && args.length) {
      this.registrationCompleteForm.patchValue({
        phone: this.phone,
      });
    }
  }

  completeRegistration(): void {
    if (!this.registrationCompleteForm.valid) {
      this.markFormGroupTouched(this.registrationCompleteForm);
    } else {
      this.isLoading = true;
      this.httpRequestService
        .request(
          'post',
          'auth-students/register',
          this.registrationCompleteForm.value
        )
        .subscribe(
          (result) => {
            this.notificationService.success(
              'Success',
              'Your Account created successfully.'
            );
            this.router.navigateByUrl('auth/login');
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            if (error.error.errors) {
              const errorMessage: string = Object.values(error.error.errors)[0]
                ? String(Object.values(error.error.errors)[0])
                : '';
              this.notificationService.error('', errorMessage);
            }
          }
        );
    }
  }

  /* Make All Form Controls Dirty */
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
