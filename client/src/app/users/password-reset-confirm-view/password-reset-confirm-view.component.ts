import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { mustMatch } from '../users.validators';
import { GuestService } from '../users.guest.service';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-password-reset-confirm-view',
  templateUrl: './password-reset-confirm-view.component.html',
  styleUrls: ['./password-reset-confirm-view.component.scss']
})
export class PasswordResetConfirmViewComponent implements OnInit {
  @ViewChild('f') ngForm: FormGroupDirective;

  submitted = false
  passwordResetConfirmForm = this.fb.group({
    new_password1: ['', [
      Validators.required,
      Validators.minLength(8)]
    ],
    new_password2: ['', [
      Validators.required]
    ]
  }, { validator: mustMatch('new_password1', 'new_password2') });

  constructor(
    private fb: FormBuilder,
    private guestService: GuestService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.passwordResetConfirmForm.valid) {
      return
    }

    this.submitted = true

    const { paramMap } = this.route.snapshot
    const uid = paramMap.get('uid')
    const token = paramMap.get('token')

    const payload = { ...this.passwordResetConfirmForm.value, uid, token }
    
    this.guestService.setNewPassword(payload)
      .subscribe(
        () => {
          this.submitted = false
          this.ngForm.resetForm()
          this.router.navigateByUrl('/login')
          this.alertService.success("Success, You can now login to your account using the new pasword");
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
                const formControlName = prop === 'password' ? 'new_password1': ''
                const formControl = this.passwordResetConfirmForm.get(formControlName);
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
