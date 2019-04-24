import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupViewComponent } from './users/signup-view/signup-view.component';
import { LoginViewComponent } from './users/login-view/login-view.component';
import { PasswordResetViewComponent } from './users/password-reset-view/password-reset-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupViewComponent },
  { path: 'login', component: LoginViewComponent },
  { path: 'forgot-password', component: PasswordResetViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
