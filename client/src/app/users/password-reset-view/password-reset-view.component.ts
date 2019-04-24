import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { GuestService } from '../users.guest.service';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-password-reset-view',
  templateUrl: './password-reset-view.component.html',
  styleUrls: ['./password-reset-view.component.scss']
})
export class PasswordResetViewComponent implements OnInit {
  @ViewChild('f') ngForm: FormGroupDirective;

  submitted = false
  passwordResetForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private guestService: GuestService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.alertService.clearMessage()

    if (!this.passwordResetForm.valid) {
      return
    }

    this.submitted = true

    const payload = this.passwordResetForm.value
    this.guestService.requestPasswordReset(payload)
      .subscribe(
        () => {
          this.submitted = false
          this.ngForm.resetForm()
          this.alertService.success('An email containing confirmation link has been successfuly sent.')
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
                const formControl = this.passwordResetForm.get(prop);
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
