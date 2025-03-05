import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-otp-confirmation',
  templateUrl: './otp-confirmation.component.html',
  styleUrls: ['./otp-confirmation.component.scss'],
})
export class OtpConfirmationComponent implements OnInit, OnChanges {
  confirmOtpForm: FormGroup;
  isLoading = false;
  @Input() phone: any;
  @Output() steppervar: EventEmitter<boolean> = new EventEmitter();
  deadline = Date.now() + 1000 * 90;
  countDownStart = true;
  current = true;
  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.confirmOtpForm = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      mobileOtpVerification: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.countDownStart = false;
    }, 90000);
  }

  ngOnChanges(...args: any[]): void {
    if (args && args.length) {
      this.confirmOtpForm.patchValue({
        phone: this.phone,
      });
    }
  }

  confirmOtp(): void {
    if (!this.confirmOtpForm.valid) {
      this.markFormGroupTouched(this.confirmOtpForm);
    } else {
      this.isLoading = true;
      this.httpRequestService
        .request(
          'post',
          'mobile-number-verifications/otp-verification',
          this.confirmOtpForm.value
        )
        .subscribe(
          (result) => {
            this.notificationService.success(
              'Success',
              'Phone number verified successfully.'
            );
            this.isLoading = false;
            this.steppervar.emit(true);
          },
          (error) => {
            this.isLoading = false;
            this.notificationService.error('', error.error.message);
          }
        );
    }
  }

  resendOtp(): void {
    // console.log(this.confirmOtpForm.value.phone);
    // return;
    this.httpRequestService
      .request('post', 'mobile-number-verifications/send-otp', {
        phone: this.confirmOtpForm.value.phone,
      })
      .subscribe(
        (success) => {
          this.notificationService.create(
            'success',
            'SUCCESS',
            'OTP re-sent in your Mobile number.'
          );
          this.current = false;

          this.countDownStart = true;
          this.deadline = Date.now() + 1000 * 90;
          setTimeout(() => {
            this.countDownStart = false;
          }, 90000);
        },
        (error) => {
          this.notificationService.create(
            'error',
            'ERROR',
            error.error.message
          );
        }
      );
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
