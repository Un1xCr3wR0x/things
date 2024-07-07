/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Alert,
  AlertIconEnum,
  AlertTypeEnum,
  BilingualText,
  checkNull,
  convertToStringDDMMYYYY,
  IdentityTypeEnum,
  LanguageToken,
  markFormGroupTouched,
  RoleIdEnum,
  scrollToTop
} from '@gosi-ui/core';
import { ManagePersonConstants } from '@gosi-ui/features/customer-information/lib/shared';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ContractAuthConstant, ContributorConstants } from '../../../../shared/constants';
import { EngagementType } from '../../../../shared/enums';
import { Contributor, DropDownItems, EngagementDetails, Establishment } from '../../../../shared/models';

const MandatoryErrorKey = 'CORE.ERROR.MANDATORY-FIELDS';
const MaxEntriedReached = 'CUSTOMER-INFORMATION.ERROR.MAX-ENTRIES-OTP';
const MobileNotVerified = 'CUSTOMER-INFORMATION.ERROR.MOBILE-NOT-VERIFIED';

@Component({
  selector: 'cnt-verify-engagement-details-dc',
  templateUrl: './verify-engagement-details-dc.component.html',
  styleUrls: ['./verify-engagement-details-dc.component.scss']
})
export class VerifyEngagementDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  /** Local variables. */
  _isValid: boolean;
  _errorRes: BilingualText;
  errorMsg = false;
  contractAuthForm: FormGroup;
  engagementLeavingDate: String;
  //Check if the entered otp is valid
  showOtp = true; // Otp Screen View
  isOtpValid: boolean; // Check the validity
  isResend = false; // Timer finished
  noOfResend = ContractAuthConstant.NO_OF_OTP_RETRIES; // Maximum no of resend possible
  showOtpError: boolean;
  noOfIncorrectOtp = 0;
  minutes = 1;
  disabledOTP = false;
  disableApply = true;
  absherVerified = true; //Field to check if the mobile number has been verified with abhser
  mobileVerifiedPage = false; // Mobile verified successfull
  otpErrorMessageKey: string;
  // alert variables
  contractInfo: Alert = new Alert();
  errorAlert: Alert;
  lang: string;
  establishmentDetails;
  modalRef: BsModalRef;
  engStartDate: string;
  private fb: FormBuilder = new FormBuilder();
  /** Input  variables. */
  @Input() newEngagementDate: string;
  @Input() engagementLeavingReason: BilingualText = new BilingualText();
  @Input() validUuid: boolean;
  @Input() engagementType: string;
  @Input() engagementDetails: EngagementDetails;
  @Input() otpError: BilingualText = new BilingualText();
  @Input() otpUnathorizedError: BilingualText = new BilingualText();
  displayNewEngDate: Date;
  popup_message: any;
  showDays: string;
  showMonth: string;
  engagementStatus: string;
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

  /** Output variables. */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() onContinueClicked = new EventEmitter<{ identity: number }>();
  @Output() onVerifyClicked: EventEmitter<string> = new EventEmitter();
  @Output() onCancelClicked: EventEmitter<null> = new EventEmitter();
  @Output() onResendOTPClicked: EventEmitter<null> = new EventEmitter();
  @Output() onApplicationReload: EventEmitter<null> = new EventEmitter();
  @Output() refresh = new EventEmitter<null>();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  /** Creates an instancce of EngagementAccordianViewDcComponent. */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>, private modalService: BsModalService) {}

  /** Method to initialize the commponent. */
  ngOnInit(): void {
    //console.log(this.engagementDetails);
    this.showOtpScreen();
    this.language.subscribe(lan => (this.lang = lan));
    this.contractAuthForm = this.fb.group({
      otp: [null],
      identity: [null, Validators.required]
    });
    //this.engagementDetailsForm.get('description').get('english').patchValue(this.descriptionContent);
    if (this.newEngagementDate) {
      this.displayNewEngDate = moment(this.newEngagementDate).toDate();
      this.newEngagementDate = convertToStringDDMMYYYY(moment(this.newEngagementDate).toString());
    }
    this.engStartDate = convertToStringDDMMYYYY(this.engagementDetails.joiningDate.gregorian.toString());
    if (
      this.engagementDetails.status === 'LIVE' ||
      this.engagementDetails.status === 'TERMINATION_IN_PROGRESS' ||
      this.engagementDetails.status === 'CANCEL_IN_PROGRESS'
    ) {
      this.engagementStatus = 'Active';
    } else {
      this.engagementStatus = 'Inactive';
    }
    this.engagementLeavingDate = convertToStringDDMMYYYY(
      moment(this.engagementDetails?.leavingDate?.gregorian).toString()
    );
  }

  /** Method to create Adjustment Details Form */
  createEngagementDetailsForm() {
    return this.fb.group({
      engagementDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      description: this.fb.group({
        english: [
          'I hereby acknowledge that all the information provided are correct and valid. I also acknowledge of the penalties provided by the GOSI laws for the incorrect and invalidity of the information given. In addition to the provided penalties in other schemes with which been approved under the two articles(6,5) of Anti-Forgery Law that is subject to imprison to a period of five years and a financial penalty of ten thousand S.R. for any proved fraudulent or false and acknowledged as true.',
          { validators: Validators.required }
        ],
        arabic: [
          'أقر وأتعهد بصحة المعلومات المقدمة، مقراً بعلمي بالعقوبات المنصوص عليها في نظام التأمينات الاجتماعية المترتبة على ثبوت عدم صحة هذه المعلومات، بالإضافة إلى العقوبات المنصوص عليها في الأنظمة الأخرى والتي من ضمنها ما تم إقراره بموجب المادتين (6،5) من نظام مكافحة التزوير من السجن بسنة إلى خمس سنوات وغرامة مالية من ألف إلى عشرة آلاف ريال لكل من اثبت وقائع أو أقوال كاذبة على أنها وقائع صحيحة ومعترف بها'
        ]
      }),
      checkBoxFlag: [null, { validators: Validators.requiredTrue }]
    });
  }
  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.otpError && changes.otpError.currentValue) {
      this.otpError = changes.otpError.currentValue;
    }
    if (changes.otpUnathorizedError && changes.otpUnathorizedError.currentValue) {
      this.otpUnathorizedError = changes.otpUnathorizedError.currentValue;
    }
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to save payment details. */
  saveAndNext() {
    this.save.emit();
  }
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    if (this.engagementType === 'Cancelengagement') {
      if (
        checkNull(this.contractAuthForm.get('otp').value) ||
        checkNull(this.contractAuthForm.get('otp').value[0]) ||
        checkNull(this.contractAuthForm.get('otp').value[3])
      ) {
        this.setError('CONTRIBUTOR.ERROR.OTP');
        this.isOtpValid = false;
        this.mobileVerifiedPage = false;
        this.absherVerified = false;
      } else {
        // this.setError('CONTRIBUTOR.ERROR.OTP');
        // this.isOtpValid = false;
        // this.mobileVerifiedPage = false;
        // this.absherVerified = false;
        this.popup_message = this.engagementDetails.engagementDuration;
        if (this.lang == 'en') {
          if (this.popup_message.noOfDays != 1) {
            this.showDays = 'Days';
          } else {
            this.showDays = 'Day';
          }

          if (this.popup_message.noOfMonths != 1) {
            this.showMonth = 'Months';
          } else {
            this.showMonth = 'Month';
          }
        } else {
          if (this.popup_message.noOfDays == 1) {
            this.showDays = 'يوم';
          } else if (this.popup_message.noOfDays == 2) {
            this.showDays = 'يومين';
          } else if (this.popup_message.noOfDays > 2 && this.popup_message.noOfDays < 11) {
            this.showDays = 'أيام';
          } else if (this.popup_message.noOfDays > 10 && this.popup_message.noOfDays < 32) {
            this.showDays = ' يوم';
          }

          if (this.popup_message.noOfMonths == 1) {
            this.showMonth = 'شهر';
          } else if (this.popup_message.noOfMonths == 2) {
            this.showMonth = 'شهرين';
          } else if (this.popup_message.noOfMonths > 2 && this.popup_message.noOfMonths < 11) {
            this.showMonth = 'أشهر';
          } else if (this.popup_message.noOfMonths > 10 && this.popup_message.noOfMonths < 1001) {
            this.showMonth = ' شهر';
          }
        }
        const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
        this.modalRef = this.modalService.show(template, config);
      }
    } else {
      this.verifyOtp();
    }
  }

  confirm() {
    this.modalRef.hide();
    this.verifyOtp();
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
    this.modalRef.hide();
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

  checkAllOtpFieldsEntered() {
    if (this.contractAuthForm.value.otp != null) {
      return checkNull(this.contractAuthForm?.get('otp')?.value[3]);
    } else {
      return true;
    }
  }
  /** Method to handle captcha and nin verification on continue button click. */
  continueAuth() {
    this.errorMsg = false;
    markFormGroupTouched(this.contractAuthForm);
    this.contractAuthForm.updateValueAndValidity();
    if (this.contractAuthForm.valid) {
      this.onContinueClicked.emit({
        identity: this.contractAuthForm.get('identity').value
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
