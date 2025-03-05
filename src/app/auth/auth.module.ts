import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyMobileNumberComponent } from './verify-mobile-number/verify-mobile-number.component';
import { RegisterComponent } from './register/register.component';
import { OtpConfirmationComponent } from './otp-confirmation/otp-confirmation.component';


@NgModule({
  declarations: [LoginComponent, VerifyMobileNumberComponent, RegisterComponent, OtpConfirmationComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
