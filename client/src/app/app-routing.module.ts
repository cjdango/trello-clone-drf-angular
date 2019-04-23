import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupViewComponent } from './users/signup-view/signup-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
