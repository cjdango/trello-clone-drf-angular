import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { GuestService } from '../users.guest.service';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {
  @ViewChild('f') ngForm: FormGroupDirective;

  submitted = false
  loginForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(8)]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private guestService: GuestService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.alertService.clearMessage()

    if (!this.loginForm.valid) {
      return
    }

    this.submitted = true

    const payload = this.loginForm.value
    this.guestService.login(payload)
      .subscribe(
        () => {
          this.submitted = false
          this.ngForm.resetForm()
          // this.router.navigateByUrl('') TODO: navigate to /boards
        }, 
        (err) => {
          this.submitted = false
          if (err instanceof HttpErrorResponse) {
            const validationErrors = err.error
            const nonFieldErrs = validationErrors.non_field_errors
            if (nonFieldErrs) {
              this.alertService.error(nonFieldErrs[0])
            }
            
            if (err.status === 400) {
              Object.keys(err.error).forEach(prop => {
                const formControl = this.loginForm.get(prop);
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
