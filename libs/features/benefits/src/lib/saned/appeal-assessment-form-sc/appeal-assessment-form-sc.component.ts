import { Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  UuidGeneratorService,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { BenefitPropertyService, BenefitResponse, BypassReassessmentService, SanedBenefitService } from '../../shared';
import { catchError, map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'bnt-appeal-assessment-form-sc',
  templateUrl: './appeal-assessment-form-sc.component.html',
  styleUrls: ['./appeal-assessment-form-sc.component.scss']
})
export class AppealAssessmentFormScComponent implements OnInit {
  disabilityType: string;
  sessionStatusForm: FormGroup = new FormGroup({});
  occAppealList$: Observable<LovList>;
  nonOccAppealList$: Observable<LovList>;
  disabilityAssessmentId: number;
  socialInsuranceNumber: number;
  nin: number;
  benefitRequestId: number;
  documentScanList: DocumentItem[] = [];
  documentForm: FormGroup = new FormGroup({});
  benefitResponse: BenefitResponse;
  heading: string;
  modalRef: BsModalRef;
  isSmallScreen = false;

  /** Otp related variables */
  radioFormControl: FormGroup = new FormGroup({});
  otpForm: FormGroup = new FormGroup({});
  authenticationList: LovList;
  showDocumentField = false;
  giveOTPData = false;
  showOTPField = true;
  noOfIncorrectOtp = 0;
  MaxEntriedReached = 'CONTRIBUTOR.ERROR.MAX-ENTRIES-OTP';
  showOtpErrorMsg: string;
  showOtpFlag = false;
  minutes = 4;
  isValidOTP = false;
  disabledOTP = false; //max entry reached
  isResend = false; // Timer finished
  noOfResend = 3;
  otpResponse;
  uuid: string;
  xOtp: string;
  otpSuccess;
  errorRes: BilingualText;
  AuthenticationErrorMessage = {
    english: 'Please Authenticate OTP/Document to proceed ',
    arabic: 'Please Authenticate OTP/Document to proceed. '
  };

  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    private documentService: DocumentService,
    private sanedBenefitService: SanedBenefitService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly location: Location,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {}

  @ViewChild('submitTemplate', { static: false })
  private submitTemplate: TemplateRef<HTMLElement>;

  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  ngOnInit(): void {
    this.disabilityAssessmentId = this.sanedBenefitService.getDisabilityAssessmentId();
    this.benefitRequestId = this.sanedBenefitService.getbenefitRequestId();
    this.socialInsuranceNumber = this.sanedBenefitService.getSocialInsuranceNumber();
    this.nin = this.sanedBenefitService.getNin();
    if (!this.socialInsuranceNumber && !this.benefitRequestId && !this.disabilityAssessmentId) {
      this.route.queryParams.subscribe(params => {
        this.socialInsuranceNumber = +params.sin;
        this.benefitRequestId = +params.benReqId;
        this.disabilityAssessmentId = +params.assessmentId;
        this.nin = +params.nin;
      });
    }
    this.occAppealList$ = this.lookupService.getMBOccupationalReasonForAppealList();
    this.nonOccAppealList$ = this.lookupService.getMbNonOccupationalReasonForAppealList();
    this.getDocsForAppeal();
    this.authenticationList = this.getAuthenticationList();
    // form to create radio button
    this.radioFormControl = this.createRadioFormControl();
    this.otpForm = this.createOtpform();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  getAuthenticationList() {
    return new LovList([
      { value: { english: 'OTP', arabic: '' }, sequence: 0, code: 10001 },
      { value: { english: 'Document', arabic: '' }, sequence: 1, code: 10002 }
    ]);
  }

  createRadioFormControl() {
    return this.fb.group({
      authMethod: this.fb.group({
        english: ['OTP', Validators.required],
        arabic: [null]
      })
    });
  }

  createOtpform() {
    return this.fb.group({ otp: [null, { validators: Validators.required }] });
  }

  getDocsForAppeal() {
    const documentList$ = this.sanedBenefitService.getReqDocsForAppeal().pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    documentList$.subscribe((documents: DocumentItem[]) =>
      documents.forEach(items => {
        if (items) {
          items.canDelete = true;
          this.documentScanList.push(items);
        }
      })
    );
  }

  submit() {
    const payload = {
      reasonForAppeal: this.sessionStatusForm?.get('appealSessionForm')?.get('reason')?.value,
      comments: this.sessionStatusForm?.get('appealSessionForm')?.get('comments')?.value
    };
    this.bypassReaassessmentService
      .appealMedicalAssessment(
        this.socialInsuranceNumber,
        this.benefitRequestId,
        this.disabilityAssessmentId,
        payload,
        this.xOtp
      )
      .subscribe(
        res => {
          this.benefitResponse = res;
          this.showSuccessMessage(this.benefitResponse?.message);
          this.benefitPropertyService.setActiveSuccessMessage(this.benefitResponse?.message);
          this.location.back();
        },
        err => this.alertService.showError(err.error.message)
      );
  }
  showSuccessMessage(message) {
    if (message) {
      this.benefitPropertyService.setBenefitAppliedMessage(message);
    }
  }
  hideCancelModal() {}
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.disabilityAssessmentId).subscribe(res => {
      document = res;
    });
  }
  showFormValidation() {}
  //Method to handle pagination logic
  cancelTransaction() {
    // this.alertService.clearAlerts;
    // this.showModal(this.confirmTemplate);
  }
  decline() {
    this.modalRef.hide();
  }
  confirm() {
    // this.modalRef.hide();
    // if (this.isHoWorkItem) {
    //   this.location.back();
    //   // this.router.navigate([RouterConstants.ROUTE_INBOX]);
    // } else {
    //   if (this.isComplication) {
    //     this.router.navigate([
    //       `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
    //     ]);
    //   } else
    //     this.router.navigate([
    //       `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    //     ]);
    //   this.alertService.clearAlerts();
    // }
  }
  onCancel() {
    this.location.back();
  }
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelTemplate, config);
  }

  showSubmitTemplate() {
    if (this.sessionStatusForm.invalid) {
      markFormGroupTouched(this.sessionStatusForm);
      this.alertService.showMandatoryErrorMessage();
      scrollToTop();
      return;
    }
    if (!this.showDocumentField && !this.isValidOTP) {
      scrollToTop();
      this.alertService.clearAllErrorAlerts();
      this.alertService.showError(this.AuthenticationErrorMessage);
      return;
    }
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.heading = 'BENEFITS.CONFIRM-SUBMIT';
    this.modalRef = this.modalService.show(this.submitTemplate, config);
  }

  submitCall(value) {}

  confirmHold() {}

  cancelHold() {}

  /** Otp related Functions */
  selectRadio(value) {
    if (value === 'OTP') {
      this.showOTPField = true;
      this.showDocumentField = false;
    } else {
      this.showDocumentField = true;
      this.giveOTPData = false;
      this.showOTPField = false;
      this.xOtp = undefined;
    }
  }
  reSendOtp() {
    this.clearAlert();
    if (this.noOfIncorrectOtp === 3) {
      this.setError(this.MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.otpForm.get('otp').reset();
    }
  }
  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === 3) {
      this.setError(this.MaxEntriedReached);
    }
  }

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.showOtpErrorMsg = messageKey;
    this.showOtpFlag = true;
  }
  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpFlag = false;
  }
  verifyOTP() {
    const otpValue = this.otpForm.get('otp').value;
    this.xOtp = this.uuid + ':' + otpValue;
    this.sanedBenefitService
      .verifyOTP(this.socialInsuranceNumber, this.benefitRequestId, this.nin, this.xOtp)
      .subscribe(
        data => {
          this.otpSuccess = data;
          if (data) {
            this.isValidOTP = true;
            this.giveOTPData = false;
            this.showOTPField = false;
            scrollToTop();
            this.alertService.showSuccessByKey('MEDICAL-BOARD.OTP-AUTHENTICATION-SUCCESS');
          } else {
            this.isValidOTP = false;
          }
          // data ? (this.isValidOTP = true) : (this.isValidOTP = false);
        },
        err => this.alertService.showError(err?.error?.message)
      );
  }
  generateOTP() {
    // }
    // verifyOTP() {
    if (this.otpSuccess?.english) {
      this.alertService.showSuccess({
        english: 'Authentication has been done. you can proceed by clicking yes',
        arabic: 'Authentication has been done. you can proceed by clicking yes'
      });
    } else {
      this.giveOTPData = true;
      // this.sanedBenefitService.getOTPValidation(this.socialInsuranceNumber).subscribe(
      this.sanedBenefitService.getOTPValidation(this.socialInsuranceNumber, this.benefitRequestId, this.nin).subscribe(
        res => {
          this.otpResponse = res;
          this.alertService.showSuccess(this.otpResponse);
          this.giveOTPData = false;
        },
        err => {
          if (err?.status === 401) {
            this.uuid = err['error']['uuid'];
            this.isValidOTP = true;
          } else {
            this.isValidOTP = false;
            this.errorRes = err['error']['message'];
          }
        }
      );
    }
  }
}
