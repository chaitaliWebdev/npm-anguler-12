import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-verify-mobile-number',
  templateUrl: './verify-mobile-number.component.html',
  styleUrls: ['./verify-mobile-number.component.scss']
})
export class VerifyMobileNumberComponent implements OnInit {
  getOtpForm: FormGroup;
  isLoading = false;
  stepValue = 1;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.getOtpForm = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('[0-9 ]{10}')]],
    });
   }

  ngOnInit(): void {
  }

  getStepValue(event: any): void{
    this.stepValue = 3;
  }

  getMyOtp(): void{
    if (!this.getOtpForm.valid) {
      this.markFormGroupTouched(this.getOtpForm);
    } else {
      this.isLoading = true;
      this.httpRequestService
        .request('post', 'mobile-number-verifications/send-otp', this.getOtpForm.value)
        .subscribe(
          (result) => {
            this.notificationService.success(
              'Success',
              'OTP sent in your Mobile number.'
            );
            this.isLoading = false;
            this.stepValue = 2;
          },
          (error) => {
            this.isLoading = false;
            this.notificationService.error('', error.error.message);
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



