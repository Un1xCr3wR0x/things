/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Alert,
  AlertIconEnum,
  AlertTypeEnum,
  BilingualText,
  checkNull,
  LanguageToken,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ContractAuthConstant } from '../../../shared';

const MaxEntriedReached = 'CONTRIBUTOR.ERROR.MAX-ENTRIES-OTP';

@Component({
  selector: 'cnt-contract-auth-dc',
  templateUrl: './contract-auth-dc.component.html',
  styleUrls: ['./contract-auth-dc.component.scss']
})
export class ContractAuthDcComponent implements OnInit {
  /** Local variables. */
  _isValid: boolean;
  _errorRes: BilingualText;
  errorMsg = false;
  contractAuthForm: FormGroup;
  //Check if the entered otp is valid
  showOtp = false; // Otp Screen View
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  noOfResend = ContractAuthConstant.NO_OF_OTP_RETRIES; // Maximum no of resend possible
  showOtpError: boolean;
  noOfIncorrectOtp = 0;
  minutes = 4;
  disabledOTP = false;
  absherVerified = true; //Field to check if the mobile number has been verified with abhser
  mobileVerifiedPage = false; // Mobile verified successfull
  otpErrorMessageKey: string;
  // alert variables
  contractInfo: Alert = new Alert();
  errorAlert: Alert;
  lang: string;

  /** Input variables. */
  @Input() public get isValid() {
    return this._isValid;
  }
  public set isValid(flag) {
    if (flag) this.showOtpScreen();
  }
  @Input() public get errorRes() {
    return this._errorRes;
  }
  public set errorRes(err) {
    scrollToTop();
    this._errorRes = err;
    this.errorAlert = new Alert();
    this.errorAlert.message = err;
    this.errorAlert.type = AlertTypeEnum.DANGER;
    this.errorAlert.dismissible = true;
    this.errorAlert.icon = AlertIconEnum.ERROR;
    this.errorMsg = true;
  }
  @Input() captcha: string;
  @Input() isEngagement:boolean;

  /** Output variables. */
  @Output() onContinueClicked = new EventEmitter<{ identity: number; captchaValue: string }>();
  @Output() onVerifyClicked: EventEmitter<string> = new EventEmitter();
  @Output() onCancelClicked: EventEmitter<null> = new EventEmitter();
  @Output() onResendOTPClicked: EventEmitter<null> = new EventEmitter();
  @Output() onApplicationReload: EventEmitter<null> = new EventEmitter();
  @Output() refresh = new EventEmitter<null>();
  @Output() showError: EventEmitter<string> = new EventEmitter();

  /** Creates  an instance of ContractAuthDcComponent. */
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    //(this.isEngagement);
    
    this.contractAuthForm = this.fb.group({
      identity: [null, Validators.required],
      captchaControl: [null, Validators.required]
    });
    this.language.subscribe(language => (this.lang = language));
  }

  /** Method to handle the show otp Screen. */
  showOtpScreen() {
    this.clearAlert();
    this.isResend = false;
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      //This timeout is set because , OTP resend is only for 3time .
      //after 3rd RESEND click on this if condition is satisfied and on the
      // same time field got disable and error msg is shown.But it should
      // be after 4:59sec after 3rd resend .
      setTimeout(() => {
        this.isResend = true;
        this.disabledOTP = true;
        this.setError(MaxEntriedReached);
      }, 296000);
    }
    if (this.contractAuthForm && this.contractAuthForm.get('identity')) {
      const idControl = this.contractAuthForm.get('identity');
      idControl.markAsTouched();
      idControl.updateValueAndValidity();
      if (idControl.valid) {
        idControl.disable();
        this.contractAuthForm.addControl('otp', new FormControl(['', Validators.required]));
        this.showOtp = !this.showOtp;
        this.isOtpValid = true;
      }
    }
  }

  /** Method to verify the mobile number in abhser with an otp. */
  verifyOtp() {
    this.clearAlert();
    if (!checkNull(this.contractAuthForm.get('otp').value) && !checkNull(this.contractAuthForm.get('otp').value[0])) {
      this.isOtpValid = true;
      this.absherVerified = true;
      this.mobileVerifiedPage = true;
      this.onVerifyClicked.emit(this.contractAuthForm.get('otp').value);
    } else if (
      checkNull(this.contractAuthForm.get('otp').value) ||
      checkNull(this.contractAuthForm.get('otp').value[0])
    ) {
      this.setError('CONTRIBUTOR.ERROR.OTP_ERROR_NO_OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    } else {
      this.setError('CONTRIBUTOR.ERROR.OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    }
  }

  /** Method to resend the otp after 2 minutes. */
  reSendOtp() {
    if (this.isOtpValid === false) {
      this.isOtpValid = true;
    }
    this.clearAlert();
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.onResendOTPClicked.emit(this.contractAuthForm.get('identity').value);
      this.isResend = false;
    }
  }

  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === ContractAuthConstant.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
    }
  }

  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpError = false;
    this.errorMsg = false;
  }

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }

  /** Method to handle cancel button click. */
  cancelAuth() {
    this.clearAlert();
    if (this.showOtp) {
      this.showOtp = false;
      this.contractAuthForm.get('identity').reset(null);
      this.contractAuthForm.get('identity').enable();
    }
    this.onCancelClicked.emit();
  }

  /** Method to reload application. */
  reLoadApplication() {
    this.cancelAuth();
    this.onApplicationReload.emit();
  }

  /** Method to handle captcha and nin verification on continue button click. */
  continueAuth() {
    this.errorMsg = false;
    markFormGroupTouched(this.contractAuthForm);
    this.contractAuthForm.updateValueAndValidity();
    if (this.contractAuthForm.valid) {
      this.onContinueClicked.emit({
        identity: this.contractAuthForm.get('identity').value,
        captchaValue: this.contractAuthForm.get('captchaControl').value
      });
    } else {
      scrollToTop();
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    }
  }
  /** captcha regenerate */
  refreshCaptcha() {
    this.refresh.emit();
  }
}
