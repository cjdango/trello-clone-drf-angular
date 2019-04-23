import { NgModule } from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  exports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
})
export class MatModule { }
