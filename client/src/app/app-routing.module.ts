import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupViewComponent } from './users/signup-view/signup-view.component';
import { LoginViewComponent } from './users/login-view/login-view.component';
import { PasswordResetViewComponent } from './users/password-reset-view/password-reset-view.component';
import { PasswordResetConfirmViewComponent } from './users/password-reset-confirm-view/password-reset-confirm-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupViewComponent },
  { path: 'login', component: LoginViewComponent },
  { path: 'forgot-password', component: PasswordResetViewComponent },
  { path: 'reset-password/:uid/:token', component: PasswordResetConfirmViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
