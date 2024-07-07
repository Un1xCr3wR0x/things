/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { UserActivityService } from '../../../shared';
import {
  AlertService,
  compareValidator,
  markFormGroupTouched,
  resetForms,
  passwordValidator,
  LoginService,
  AuthTokenService
} from '@gosi-ui/core';
import { PasswordInfoDcComponent } from './password-info-dc/password-info-dc.component';
const minLength = 8;
@Component({
  selector: 'cim-change-password-sc',
  templateUrl: './change-password-sc.component.html',
  styleUrls: ['./change-password-sc.component.scss']
})
export class ChangePasswordScComponent implements OnInit {
  @ViewChild('newPassword', { static: false }) newPasswordInfo: PasswordInfoDcComponent;
  /**
   * Local variables
   */
  modalRef: BsModalRef;
  changePasswordForm: FormGroup;
  showSuggestion = false;
  constructor(
    readonly userActivityService: UserActivityService,
    private formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly location: Location,
    private alertService: AlertService,
    private loginService: LoginService,
    private authTokenService: AuthTokenService
  ) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.changePasswordForm = this.createChangePasswordForm();
    this.changePasswordForm.get('newPassword').valueChanges.subscribe(() => {
      this.changePasswordForm.get('confirmPassword').updateValueAndValidity();
    });
  }
  /**
   * Method to confirm cancel
   */
  confirmCancel() {
    this.changePasswordForm.reset();
    this.modalRef.hide();
    this.location.back();
  }
  /**
   * Method to perform decline operation
   */
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to show modal
   * @param template
   */
  cancel(template: TemplateRef<HTMLElement>) {
    this.clearAlerts();
    this.modalRef = this.modalService.show(template);
  }
  /**
   * Method to perform change password
   */
  changePassword() {
    this.clearAlerts();
    this.changePasswordForm.get('confirmPassword').updateValueAndValidity();
    this.changePasswordForm.updateValueAndValidity();
    if (this.changePasswordForm.valid) {
      this.userActivityService.changePassword(this.changePasswordForm.value).subscribe(() => {
        resetForms(this.changePasswordForm);
        setTimeout(() => {
          this.authTokenService.doLogout();
        }, 2000);
      });
    } else {
      markFormGroupTouched(this.changePasswordForm);
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   * Method to create change password form
   */
  createChangePasswordForm(): FormGroup {
    return this.formBuilder.group(
      {
        oldPassword: ['', { validators: Validators.compose(this.getValidators(false, false, false, false)) }],
        newPassword: [
          '',
          { validators: Validators.compose(this.getValidators(true, true, true, true, 'oldPassword', true)) }
        ],
        confirmPassword: [
          '',
          { validators: Validators.compose(this.getValidators(false, false, false, true, 'newPassword')) }
        ]
      },
      { updateOn: 'blur' }
    );
  }
  /**
   * Method to assign validator to form control
   * @param isCustomValidator
   */
  getValidators(
    isPatternValidator: boolean,
    isMinLengthValidator: boolean,
    isPasswordValidator: boolean,
    isCustomValidator: boolean,
    compareControlName?: string,
    isEquals = false
  ): ValidatorFn[] {
    const passwordValidators = [Validators.required];
    if (isPatternValidator)
      passwordValidators.push(
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])([A-Za-z][a-zA-Z0-9!@#$%^&]{8,})$')
      );
    if (isMinLengthValidator) passwordValidators.push(Validators.minLength(minLength));
    if (isPasswordValidator) passwordValidators.push(passwordValidator);
    if (isCustomValidator) passwordValidators.push(compareValidator(compareControlName, isEquals));
    return passwordValidators;
  }
  /**
   *
   * @param value method to check new password validation
   */
  newPasswordchanges(value: string) {
    this.newPasswordInfo.checkValidity(value);
  }
  /**
   *
   * @param value method to change show suggestion
   */
  changeSuggestion(value: boolean) {
    this.clearAlerts();
    this.showSuggestion = value;
  }
  /**
   * clear alerts
   */
  clearAlerts() {
    this.alertService.clearAlerts();
  }
}
