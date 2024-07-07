/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  DocumentItem,
  DocumentService,
  LanguageToken,
  markFormGroupTouched,
  UuidGeneratorService,
  CoreBenefitService,
  CoreActiveBenefits,
  IdentityTypeEnum,
  RouterConstants,
  LovList,
  BilingualText,
  scrollToTop
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitResponse, HoldBenefitDetails, StopSubmitRequest } from '../../shared/models';
import { BypassReassessmentService, SanedBenefitService } from '../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createRequestBenefitForm, clearAlerts, getIdentityLabel } from '../../shared/utils';
import { AssessmentConstants, BenefitConstants } from '../../shared/constants';
import { switchMap } from 'rxjs/operators';
import { DocumentTypeId } from '../../shared';

@Component({
  selector: 'bnt-assessment-decision-display-sc',
  templateUrl: './assessment-decision-display-sc.component.html',
  styleUrls: ['./assessment-decision-display-sc.component.scss']
})
export class AssessmentDecisionDisplayScComponent implements OnInit {
  /**
   * Local Variables
   */
  activeBenefit: CoreActiveBenefits;
  assessmentRequestId: number;
  benefitRequestId: number;
  benefitResponse: BenefitResponse;
  benefitsForm: FormGroup = new FormGroup({});
  modalRef: BsModalRef;
  currentTab = 0;
  declarationDone: boolean;
  doctransactionType: string;
  documentList: DocumentItem[] = [];
  holdBenefitDetails: HoldBenefitDetails = new HoldBenefitDetails();
  identity: CommonIdentity | null;
  isAppPrivate = false;
  isAppPublic = false;
  isAppMb = false;
  isIndividualApp = false;
  isSmallScreen: boolean;
  iscolfour = true;
  lang = 'en';
    referenceNo: number;
  sin: number;
  transactionId: string;
  uuid: string;
  disabilityReferenceNo: string;
  nin: number;
  showOtpError: boolean;
  personId: number;
  identityLabel = '';
  benefitType: string;
  heirSin: number;
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  pensionReform= false;

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
  xOtp: string;
  otpResponse;
  otpSuccess;
  otpuuid: string;
  errorRes: BilingualText;
  AuthenticationErrorMessage = {
    english: 'Please Authenticate OTP/Document to proceed ',
    arabic: 'Please Authenticate OTP/Document to proceed. '
  };

  /**
   *
   * @param location
   * @param router
   * @param activatedRoute
   * @param alertService
   * @param modalService
   * @param uuidGeneratorService
   * @param documentService
   * @param bypassReaassessmentService
   * @param modifyPensionService
   * @param fb
   * @param appToken
   * @param language
   */
  constructor(
    private location: Location,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly documentService: DocumentService,
    private sanedBenefitService: SanedBenefitService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) { }
  /**
   * Method to initialsie tasks
   */
  ngOnInit(): void {
    this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
    this.setActiveBenefitValues();
    this.checkApplicationType();
    this.activatedRoute.queryParams.subscribe(params => {
      if (!this.isAppMb) this.assessmentRequestId = params.assessmentId;
      this.referenceNo = params.referenceNo;
      this.nin = params.personId;
    });
    this.doctransactionType = BenefitConstants.REQUEST_BENEFIT_FO;
    this.uuid = this.uuidGeneratorService.getUuid();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transactionId = AssessmentConstants.DISABILITY_ASSESSMENT;
    this.benefitsForm = createRequestBenefitForm(!this.isAppMb, this.fb);
    if (this.isAppMb) {
      this.getStandaloneAssessment();
    } else {
      this.getMedicalAssessment();
      this.getModifyRequiredDocs(this.transactionId, this.doctransactionType);
    }
    this.getScreenSize();
    this.authenticationList = this.getAuthenticationList();
    // form to create radio button
    this.radioFormControl = this.createRadioFormControl();
    this.otpForm = this.createOtpform();
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
  checkApplicationType() {
    switch (this.appToken) {
      case ApplicationTypeEnum.PRIVATE:
        this.isAppPrivate = true;
        break;
      case ApplicationTypeEnum.MBASSESSMENT_APP:
        this.isAppMb = true;
        break;
      case ApplicationTypeEnum.PUBLIC:
        this.isAppPublic = true;
        break;
      case ApplicationTypeEnum.INDIVIDUAL_APP:
        this.isIndividualApp = true;
        break;
    }
  }
  /** Method to router back to previous page */
  routeBack() {
    this.location.back();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 768 ? true : false;
  }
  /**
   * Method to get required docs
   * @param transactionId
   * @param modifyTransactionType
   */
  getModifyRequiredDocs(transactionId, transactionType) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(documents => {
      this.documentList = documents;
      this.documentList.forEach(doc => {
        if (doc.documentTypeId === DocumentTypeId.DECLARATION_DOCUMENT) {
          doc.identifier = checkIqamaOrBorderOrPassport(
            this.activeBenefit?.assessmentDetails?.assessmentDetails?.disabledIdentifier
          )?.id?.toString();
        }
        doc.canDelete = true;
      });
    });
  }
  //Metod to set active benefits value
  setActiveBenefitValues() {
    if (this.activeBenefit) {
      this.sin = this.activeBenefit?.sin;
      this.benefitRequestId = this.activeBenefit?.benefitRequestId;
      this.referenceNo = this.activeBenefit?.referenceNo;
      this.benefitType = this.activeBenefit.benefitType.english;
    }
  }
  /**
   * MEthod to get medical assessment details
   */
  getMedicalAssessment() {
    this.bypassReaassessmentService
      .getMedicalAssessment(this.benefitRequestId, this.assessmentRequestId, this.sin)
      .subscribe(
        res => {
          this.holdBenefitDetails = res;
          this.personId = res?.personId;
          const identity = res?.contributor?.identity;
          this.pensionReform= this.holdBenefitDetails?.pensionReformEligibility;
          this.identity = checkIqamaOrBorderOrPassport(identity);
          this.identityLabel = getIdentityLabel(this.identity);
          this.getPersonDetailsByNin(
            checkIqamaOrBorderOrPassport(this.holdBenefitDetails?.assessmentDetails?.disabledIdentifier)?.id
          );
        },
        err => this.alertService.showError(err.error?.message)
      );
  }
  acceptStandaloneAssessment() {
    markFormGroupTouched(this.benefitsForm);
    if (this.declarationDone) {
      this.bypassReaassessmentService.acceptStandaloneAssessment(this.referenceNo, this.nin).subscribe(
        res => {
          this.benefitResponse = res;
          this.acceptAssessment();
        },
        err => this.alertService.showError(err.error?.message)
      );
    } else {
      this.alertService.clearAlerts();
      this.alertService.showWarningByKey('BENEFITS.DECLARE-CHECK-INFO');
    }
  }
  getStandaloneAssessment() {
    this.bypassReaassessmentService.getStandaloneAssessment(this.referenceNo, this.nin).subscribe(
      res => {
        this.holdBenefitDetails = res;
        if (
          this.holdBenefitDetails?.assessmentDetails?.recordStatus === 'Accepted' ||
          this.holdBenefitDetails?.assessmentDetails?.recordStatus === 'Auto-Accepted'
        )
          this.acceptAssessment();
        const identity = res?.contributor?.identity;
        this.identity = checkIqamaOrBorderOrPassport(identity);
        this.identityLabel = getIdentityLabel(this.identity);
        this.benefitType = this.holdBenefitDetails?.pension?.annuityBenefitType?.english;
      },
      err => this.alertService.showError(err.error?.message)
    );
  }

  /**
   * Method to refresh doc
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.assessmentRequestId,
          this.transactionId,
          this.doctransactionType,
          this.referenceNo,
          undefined,
          this.uuid
        )
        .subscribe(res => {
          if (res) document = res;
        });
    }
  }
  /**
   * MEthod to show appeal modal
   * @param templateRef
   */
  showAppeal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
  /** This method is to make Apply enable/disable on declaration   */
  changeCheck(event) {
    this.declarationDone = event.target.checked;
    if (this.declarationDone) {
      this.alertService.clearAllErrorAlerts();
      this.alertService.clearAllWarningAlerts();
    }
    //  else {
    //   this.alertService.clearAlerts();
    //   this.alertService.showWarningByKey('BENEFITS.DECLARE-CHECK-MSG');
    // }
  }
  appealAssessmentDetails() {
    this.router.navigate(['home/benefits/saned/appealAssessment'], {
      queryParams: {
        sin: this.sin,
        benReqId: this.benefitRequestId,
        assessmentId: this.assessmentRequestId,
        nin: this.nin
      }
    });
    // this.bypassReaassessmentService.appealStandaloneAssessment(this.referenceNo, this.nin).subscribe(
    //   res => {
    //     this.benefitResponse = res;
    //     this.acceptAssessment();
    //   },
    //   err => this.alertService.showError(err.error.message)
    // );
    // if (!this.holdBenefitDetails?.assessmentDetails?.isAssessment) {
    //   window.open('https://gositest.gosi.ins/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    //   //window.open('https://www.gosi.gov.sa/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    // }
  }
  // Method to submit assessment details.
  submitAssessmentDetails() {
    if (!this.showDocumentField && !this.isValidOTP) {
      scrollToTop();
      this.alertService.clearAllErrorAlerts();
      this.alertService.showError(this.AuthenticationErrorMessage);
      return;
    }
    if ((this.showDocumentField && this.checkMandatoryDocs()) || (!this.showDocumentField && this.isValidOTP)) {
      this.submitMedicalAssessment();
    } else this.alertService.showMandatoryErrorMessage();
  }
  submitMedicalAssessment() {
    const submitValues: StopSubmitRequest = {
      uuid: this.uuid
    };
    this.bypassReaassessmentService
      .submitMedicalAssesment(this.sin, this.benefitRequestId, this.assessmentRequestId, submitValues, this.xOtp)
      .subscribe(
        res => {
          this.benefitResponse = res;

          if (this.benefitResponse.message != null) {
            this.alertService.showSuccess(this.benefitResponse.message);
          }
          this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.sin)]);
        },
        err => this.alertService.showError(err.error?.message)
      );
  }
  acceptAssessment() {
    this.currentTab++;
  }
  checkMandatoryDocs() {
    return this.documentService.checkMandatoryDocuments(this.documentList);
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
  navigateToContributor() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)]);
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  navigateToProfile(id) {
    this.router.navigate([BenefitConstants.ROUTE_PROFILE(this.heirSin)], {
      state: { loadPageWithLabel: 'PERSONAL-DETAILS' }
    });
  }

  getPersonDetailsByNin(id) {
    this.coreBenefitService
      .getPersonByNin(id)
      .pipe(
        switchMap(res => {
          return this.getPersonDetailsById(res?.listOfPersons[0]?.personId);
        })
      )
      .subscribe(res => (this.heirSin = res.socialInsuranceNo));
  }
  getPersonDetailsById(personId) {
    return this.coreBenefitService.getPersonById(personId);
  }
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
    this.xOtp = this.otpuuid + ':' + otpValue;
    this.sanedBenefitService.verifyOTP(this.sin, this.benefitRequestId, this.activeBenefit?.nin, this.xOtp).subscribe(
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
      // this.sanedBenefitService.getOTPValidation(this.sin).subscribe(
      this.sanedBenefitService.getOTPValidation(this.sin, this.benefitRequestId, this.activeBenefit?.nin).subscribe(
        res => {
          this.otpResponse = res;
          this.alertService.showSuccess(this.otpResponse);
          this.giveOTPData = false;
        },
        err => {
          if (err?.status === 401) {
            this.otpuuid = err['error']['uuid'];
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
