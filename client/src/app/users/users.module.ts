import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatModule } from '../mat.module'
import { SignupViewComponent } from './signup-view/signup-view.component'

@NgModule({
  declarations: [SignupViewComponent],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
