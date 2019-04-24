import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupViewComponent } from './users/signup-view/signup-view.component';
import { LoginViewComponent } from './users/login-view/login-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupViewComponent },
  { path: 'login', component: LoginViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
