import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'

import { mustMatch } from '../users.validators';
import { GuestService } from '../users.guest.service'

@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
  styleUrls: ['./signup-view.component.scss']
})
export class SignupViewComponent implements OnInit {
  @ViewChild('f') ngForm: FormGroupDirective;

  submitted = false
  signupForm = this.fb.group({
    first_name: ['', [
      Validators.required,
      Validators.minLength(2)]
    ],
    last_name: ['', [
      Validators.required,
      Validators.minLength(2)]
    ],
    email: ['', [
      Validators.required,
      Validators.email]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(8)]
    ],
    password2: ['', [
      Validators.required]
    ]
  }, { validator: mustMatch('password', 'password2') });

  constructor(
    private fb: FormBuilder,
    private guestService: GuestService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return
    }

    this.submitted = true

    const payload = this.signupForm.value
    this.guestService.createUser(payload)
      .subscribe(
        () => {
          this.submitted = false
          this.ngForm.resetForm()
        }, 
        (err) => {
          this.submitted = false
          if (err instanceof HttpErrorResponse) {
            const validationErrors = err.error

            if (err.status === 400) {
              Object.keys(err.error).forEach(prop => {
                const formControl = this.signupForm.get(prop);
                if (formControl) {
                  // activate the error message
                  formControl.setErrors({
                    serverError: validationErrors[prop]
                  });
                }
              });
            }
          }
        })
  }
}
