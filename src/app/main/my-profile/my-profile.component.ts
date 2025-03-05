import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import {
  ConfigurationService,
  HttpRequestService,
} from 'src/app/core/services';
import { Observable, Observer, Subject } from 'rxjs';
import { CommunicationService } from 'src/app/core/services/communication.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  buttonLoading = false;
  changePasswordForm: any;
  isLoading = false;
  passwordChangeLoading = false;
  viewPassword = false;
  viewReEnterPassword = false;
  imgLoading = false;
  avatarUrl = '';
  mediaUploadUrl: string;
  mediaPreviewUrl: string;
  fileObject: any;
  deletedFileArray: any[] = []; 
  // avatarUrl?: string;

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private configurationService: ConfigurationService,
    private msg: NzMessageService,
    private communicationService : CommunicationService
  ) {
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
    this.mediaPreviewUrl = configurationService.mediaBaseUrl;

    this.profileForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null],
      college: [null],
      institute: [null],
      email: [null],
      profilePicture: [null],
    });
    this.changePasswordForm = this.fb.group({
      password: [null, Validators.required],
      reEnterPassword: [
        null,
        [Validators.required, this.confirmationValidator],
      ],
    });
  }

  ngOnInit(): void {
    this.getProfile();
  }

  /* Get  profile details by Id */
  getProfile(): void {
    this.httpRequestService.request('get', `auth-students/profile`).subscribe(
      (result: any) => {
        console.log(result);
        this.profileForm.patchValue({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          phone: result.data.phone,
          college: result.data.college?.collegeName,
          institute: result.data.institute?.instituteName,
          // profilePicture: result.data.profilePicture,
          profilePicture: result.data.profilePicture
            ? result.data.profilePicture._id
            : '',
        });
        // if (result.data && result.data.profilePicture) {
        //   this.fileObject = result.data.profilePicture;
        // }
        this.avatarUrl = result.data.profilePicture
          ? this.mediaPreviewUrl + result.data.profilePicture.path
          : '';
      },
      (error: any) => {}
    );
  }

  /* Submit UpdateProfileForm */
  submit(): void {
    // console.log(this.profileForm.value);

    if (!this.profileForm.valid) {
      this.markFormGroupTouched(this.profileForm);
    } else {
      // console.log(this.profileForm.value);
      this.UpdateProfile(
        'put',
        `auth-students/profile`,
        'Profile Successfully Updated'
      );
    }
  }

  /* update profile */
  UpdateProfile(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    console.log(this.profileForm.value);
    this.buttonLoading = true;
    const sendData = { ...this.profileForm.value };
    delete sendData.email;
    delete sendData.phone;
    delete sendData.college;
    delete sendData.institute;
    if(!sendData.profilePicture || sendData.profilePicture == '')
    {
      delete sendData.profilePicture;
    }

    this.httpRequestService
      .request(requestMethod, requestURL, sendData)
      .subscribe(
        (result: any) => {
          this.notificationService.success('Success', successMessage);
          this.buttonLoading = false;
          this.communicationService.profileChange.next(true);
        },
        (error: any) => {
          this.notificationService.error('', error.error.message);
          this.buttonLoading = false;
        }
      );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.changePasswordForm.controls.password.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.changePasswordForm.controls.reEnterPassword.updateValueAndValidity()
    );
  }

  updatePassword(): void {
    if (!this.changePasswordForm.valid) {
      this.markFormGroupTouched(this.changePasswordForm);
    } else {
      this.passwordChangeLoading = true;
      this.httpRequestService
        .request('post', 'auth-students/change-password', {
          password: this.changePasswordForm.value.password,
        })
        .subscribe(
          (success) => {
            this.notificationService.success(
              'Success',
              'Successfully Password Updated '
            );
            this.changePasswordForm.reset();
            this.passwordChangeLoading = false;
            // this.router.navigateByUrl('/main/dashboard');
          },
          (error) => {
            this.passwordChangeLoading = false;
            this.notificationService.error('error', error.error.message);
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

  /** Media */
  customRequestHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }

  /** For media Upload */
  beforeUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG or PNG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 2 : false;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  }
  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result ? reader.result.toString() : '')
    );
    reader.readAsDataURL(img);
  }

  handleChangeForProfileImage(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        break;
      case 'done':
        this.profileForm.patchValue({
          profilePicture: info.file.response.data._id,
        });
        // console.log(this.profileForm.value);
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }
}
