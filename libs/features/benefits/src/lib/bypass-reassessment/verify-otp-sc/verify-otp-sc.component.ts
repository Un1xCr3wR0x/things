/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Alert,
  AlertIconEnum,
  AlertService,
  AlertTypeEnum,
  BilingualText,
  checkNull,
  LanguageToken,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BypassReassessmentService } from '../../shared/services';
import { AssessmentConstants } from '../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { clearAlerts } from '../../shared';
const MaxEntriedReached = 'BENEFITS.OTP-EXCEED-INFO';

@Component({
  selector: 'bnt-verify-otp-sc',
  templateUrl: './verify-otp-sc.component.html',
  styleUrls: ['./verify-otp-sc.component.scss']
})
export class VerifyOtpScComponent implements OnInit, OnDestroy {
  /**
   * Local Variables
   */
  absherVerified = true; //Field to check if the mobile number has been verified with abhser
  lang = 'en';
  minutes = 4;
  mobileVerifiedPage = false; // Mobile verified successfull
  referenceNo: string;
  uuid: string;
  verifyOtpForm: FormGroup = new FormGroup({});
  modalRef: BsModalRef;
  displayAlert = false;
  isNullOtp = false;
  mobileNumber: string;
  isInValid = false;
  isOtpNull: boolean;
  /**
   * OTP related variables
   */
  _errorRes: BilingualText;
  _isValid: boolean;
  disabled = false;
  disabledOTP = false;
  errorAlert: Alert;
  errorMsg = false;
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  isOtpResend = false;
  noOfIncorrectOtp = 0;
  noOfResend = AssessmentConstants.NO_OF_OTP_RETRIES; // Maximum no of resend possible
  otpErrorMessageKey: string;
  personId: number;
  showOtp = false; // Otp Screen View
  showOtpError: boolean;
  xOtp: string;
  inCorrectOtp = 0;

  /** Getters and setters */
  public get isValid() {
    return this._isValid;
  }
  public set isValid(flag) {
    if (flag) this.showOtpScreen();
  }
  public get errorRes() {
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
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  /**
   *
   * @param fb
   * @param activatedRoute
   * @param bypassService
   * @param alertService
   * @param modalService
   * @param language
   * @param location
   */
  constructor(
    readonly fb: FormBuilder,
    readonly activatedRoute: ActivatedRoute,
    readonly bypassService: BypassReassessmentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    private location: Location,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.verifyOtpForm = this.fb.group({
      identity: [null, Validators.required],
      otp: [null, Validators.required]
    });
    this.isValid = this.bypassService.getisValid();
    this.language.subscribe(language => (this.lang = language));
    this.mobileNumber = this.bypassService.getMobileNo();
    this.uuid = this.bypassService.getUuid();
  }

  /** Method to handle the show otp Screen. */
  showOtpScreen() {
    this.clearAlert();
    this.isResend = false;
    if (this.noOfIncorrectOtp === AssessmentConstants.NO_OF_OTP_RETRIES) {
      //This timeout is set because , OTP resend is only for 3time .
      //after 3rd RESEND click on this if condition is satisfied and on the
      // same time field got disable and error msg is shown.But it should
      // be after 4:59sec after 3rd resend .
      setTimeout(() => {
        this.isResend = true;
        this.isInValid = false;
        this.isNullOtp = false;
        this.disabledOTP = true;
        this.setError(MaxEntriedReached);
      }, 296000);
    }
    this.setIdentity();
    if (this.verifyOtpForm && this.verifyOtpForm.get('identity')) {
      const idControl = this.verifyOtpForm.get('identity');
      idControl.markAsTouched();
      idControl.updateValueAndValidity();
      if (idControl.valid) {
        idControl.disable();
        this.verifyOtpForm.addControl('otp', new FormControl(['', Validators.required]));
        this.showOtp = !this.showOtp;
        this.isOtpValid = true;
      }
    }
  }
  setIdentity() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.personId = params.personId;
      this.referenceNo = params.referenceNo;
      this.verifyOtpForm.get('identity').setValue(this.personId);
      if (this.personId) this.disabled = true;
    });
  }

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.otpErrorMessageKey = messageKey;
    this.showOtpError = true;
  }
  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpError = false;
    this.errorMsg = false;
  }
  navigateToAssessment() {
    this.router.navigate([AssessmentConstants.ROUTE_ASSESSMENT_DISPLAY], {
      queryParams: {
        personId: this.personId,
        referenceNo: this.referenceNo
      }
    });
  }
  /** Method to verify the mobile number in abhser with an otp. */
  verifyOtp() {
    this.clearAlert();
    if (!checkNull(this.verifyOtpForm.get('otp')?.value && !checkNull(this.verifyOtpForm.get('otp').value[0]))) {
      this.isOtpValid = true;
      this.absherVerified = true;
      this.mobileVerifiedPage = true;
      this.verifyOTP(this.verifyOtpForm.get('otp')?.value);
    } else if (checkNull(this.verifyOtpForm.get('otp')?.value) || checkNull(this.verifyOtpForm.get('otp')?.value[0])) {
      this.isNullOtp = true;
      this.isInValid = false;
      this.setError('BENEFITS.ERROR.OTP_ERROR_NO_OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    } else {
      this.setError('BENEFITS.ERROR.OTP');
      this.isOtpValid = false;
      this.mobileVerifiedPage = false;
      this.absherVerified = false;
    }
  }
  /* on verify click verify OTP. */
  verifyOTP(otpValue) {
    this.xOtp = this.uuid + ':' + otpValue;
    this.bypassService.verifyOTP(this.referenceNo, this.personId, this.xOtp).subscribe(
      data => {
        this.bypassService.authorization = data.headers.get('Authorization');
        this.navigateToAssessment();
      },
      err => {
        this.isInValid = true;
        this.isOtpValid = false;
        markFormGroupTouched(this.verifyOtpForm);
        this.alertService.clearAlerts();
        this.verifyOtpForm.get('otp').reset();
        this.inCorrectOtp++;
        this.alertService.showError(err.error?.message);
        if (this.inCorrectOtp === 3 || (this.isOtpResend && this.inCorrectOtp % 3 === 0)) {
          this.disabledOTP = true;
        } else {
          this.disabledOTP = false;
        }
      }
    );
  }

  /** Method to resend the otp after 2 minutes. */
  reSendOtp() {
    this.bypassService.resendOTP(this.referenceNo, this.personId).subscribe(
      data => {
        this.bypassService.authorization = data.headers.get('Authorization');
        this.navigateToAssessment();
      },
      err => {
        if (err.status === 401) {
          this.uuid = err['error']['uuid'];
          this.isOtpResend = true;
          this.bypassService.setUuid(this.uuid);
          this.isValid = true;
        }
      }
    );
    // this.verifyOtp();
    if (this.isOtpValid === false) this.isOtpValid = true;
    this.clearAlert();
    if (this.noOfIncorrectOtp === AssessmentConstants.NO_OF_OTP_RETRIES) {
      this.setError(MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.disabledOTP = false;
      this.isResend = false;
    }
  }

  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === AssessmentConstants.NO_OF_OTP_RETRIES) {
      this.displayAlert = true;
      this.setError(MaxEntriedReached);
    }
    this.isResend = true;
    this.isInValid = false;
    this.isNullOtp = false;
  }
  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.showModal(this.cancelTemplate);
  }
  /** This method is to show the modal reference */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.modalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  confirm() {
    this.modalRef.hide();
    this.routeBack();
    this.alertService.clearAlerts();
  }
  //This method is to decline cancellation of transaction
  decline() {
    this.modalRef.hide();
  }
  /** Method to router back to previous page */
  routeBack() {
    this.location.back();
  }
  /** Method to handle clearing alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
