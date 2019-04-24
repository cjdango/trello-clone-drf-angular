import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from '../app-routing.module';
import { MatModule } from '../mat.module';
import { SignupViewComponent } from './signup-view/signup-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { PasswordResetViewComponent } from './password-reset-view/password-reset-view.component';
import { PasswordResetConfirmViewComponent } from './password-reset-confirm-view/password-reset-confirm-view.component';

@NgModule({
  declarations: [SignupViewComponent, LoginViewComponent, PasswordResetViewComponent, PasswordResetConfirmViewComponent],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class UsersModule { }
