import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { Location } from '@angular/common';

import {
  AlertService,
  AppealReason,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  MedicalboardAssessmentService,
  RoleIdEnum,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  EstablishmentService,
  InjuryService,
  OhBaseScComponent,
  OhService,
  WithdrawAppealReason
} from '../../shared';
import { BehaviorSubject, noop, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { OhBPMRequest } from '../../shared/models/oh-bpm-request';

@Component({
  selector: 'oh-appeal-assessment-form-sc',
  templateUrl: './appeal-assessment-form-sc.component.html',
  styleUrls: ['./appeal-assessment-form-sc.component.scss']
})
export class AppealAssessmentFormScComponent extends OhBaseScComponent implements OnInit {
  modalRef: BsModalRef;
  sessionStatusForm: FormGroup = new FormGroup({});
  appealList$: Observable<LovList>;
  occAppealList$: Observable<LovList>;
  nonOccAppealList$: Observable<LovList>;
  withdrawAppealList$: Observable<LovList>;
  uploadFailed: any;
  documentForm: FormGroup = new FormGroup({});
  isSmallScreen: boolean;
  disabilityAssessmentId: any;
  submitAssessment: AppealReason = new AppealReason();
  submitWithdraw: WithdrawAppealReason = new WithdrawAppealReason();
  successMessage: BilingualText;
  isWithdraw = false;
  heading: string;
  documentScanList: DocumentItem[] = [];
  authenticationDocList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  occList: LovList;
  nonOccList: LovList;
  withdrawList: LovList;
  disabilityType: string;
  identifier: number;
  isDatePassed: boolean;
  isDocumentUpload = false;
  isContributor = false;
  isMbo = false;
  isHoDoctor = false;
  isGosiDoctor: boolean = false;
  isHoWorkItem = false;
  isComplication = false;
  isCSR = false;
  uuid: string;
  setHoTrue = false;
  gosiscp;
  isHeadOfficerLogin = false;
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
  otpResponse: BilingualText;
  otpSuccess;
  AuthenticationErrorMessage = {
    english: 'Please Authenticate OTP/Document to proceed ',
    arabic: 'Please Authenticate OTP/Document to proceed. '
  };
  docTransactionId = '';
  errorRes: BilingualText;
  xOtp: string;

  constructor(
    readonly authTokenService: AuthTokenService,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly location: Location,
    readonly medicalboardAssessmentService: MedicalboardAssessmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly uuidGeneratorService: UuidGeneratorService,
    @Inject(LanguageToken) language: BehaviorSubject<string>,
    readonly diseaseService: DiseaseService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken
    );
  }
  @ViewChild('confirmSubmitMbo', { static: false })
  private confirmSubmitMbo: TemplateRef<HTMLElement>;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  ngOnInit(): void {
    this.isWithdraw = false;
    this.alertService.clearAlerts();
    this.occAppealList$ = this.lookupService.getMBOccupationalReasonForAppealList();
    this.withdrawAppealList$ = this.lookupService.getMbWithdrawReasonForAppealList();
    this.nonOccAppealList$ = this.lookupService.getMbNonOccupationalReasonForAppealList();
    // this.occList = new LovList([
    //   { value: { english: 'Decision text (Decision content)', arabic: 'نص القرار' }, sequence: 0, code: 1001 },
    //   { value: { english: 'Re-assessment date', arabic: 'تاريخ إعادة الكشف' }, sequence: 1, code: 1002 },
    //   { value: { english: 'Helper required eligibility', arabic: 'استحقاق معونة الغير' }, sequence: 2, code: 1003 },
    //   { value: { english: 'Helper required date', arabic: 'تاريخ إستحقاق معونة الغير' }, sequence: 3, code: 1004 },
    //   { value: { english: 'Disability percentage', arabic: 'نسبة العجز' }, sequence: 4, code: 1005 },
    //   { value: { english: 'Case not stable', arabic: 'عدم استقرار الحالة' }, sequence: 5, code: 1006 },
    //   { value: { english: 'Other', arabic: 'أخرى' }, sequence: 6, code: 1007 }
    // ]);
    // this.nonOccList = new LovList([
    //   { value: { english: 'Decision text (Decision content)', arabic: 'نص القرار' }, sequence: 0, code: 1001 },
    //   { value: { english: 'Re-assessment date', arabic: 'تاريخ إعادة الكشف' }, sequence: 1, code: 1002 },
    //   { value: { english: 'Helper required eligibility', arabic: 'استحقاق معونة الغير' }, sequence: 2, code: 1003 },
    //   { value: { english: 'Helper required date', arabic: 'تاريخ إستحقاق معونة الغير' }, sequence: 3, code: 1004 },
    //   { value: { english: 'Date of disability establishment', arabic: 'تاريخ ثبوت العجز' }, sequence: 4, code: 1005 },
    //   { value: { english: 'Disability assessment decision', arabic: 'قرار تقييم العجز' }, sequence: 5, code: 1006 },
    //   { value: { english: 'Other', arabic: 'أخرى' }, sequence: 6, code: 1007 }
    // ]);
    // this.withdrawList = new LovList([
    //   {
    //     value: { english: 'The appeal was found to be invalid', arabic: 'تبين عدم صحة الاعتراض'},
    //     sequence: 0,
    //     code: 1001
    //   },
    //   {
    //     value: {
    //       english: 'The presence of medical reports that were not previously reviewed but were later reviewed',
    //       arabic: 'وجود تقارير طبية لم يتم الاطلاع عليها مسبقاً وتم الاطلاع عليها لاحقاً'
    //     },
    //     sequence: 1,
    //     code: 1002
    //   },
    //   {
    //     value: {
    //       english: 'lack of knowledge of the content of the decision and its benefit before the appeal',
    //       arabic: 'عدم معرفة المشترك بمضمون القرار والفائدة منه قبل الاعتراض'
    //     },
    //     sequence: 2,
    //     code: 1003
    //   },
    //   {
    //     value: {
    //       english: 'The participant is convinced of the content of the Primary Medical Board decision',
    //       arabic: 'اقتناع المشترك بمضمون قرار اللجنة الطبية الابتدائية'
    //     },
    //     sequence: 3,
    //     code: 1004
    //   },
    //   {
    //     value: {
    //       english: 'There are no medical reports that contradict the decision of the primary medical committee',
    //       arabic: 'عدم وجود تقارير طبية مضادة لقرار اللجنة الطبية الابتدائية'
    //     },
    //     sequence: 4,
    //     code: 1005
    //   },
    //   { value: { english: 'Other', arabic: 'أخرى' }, sequence: 5, code: 1006 }
    // ]);

    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.personId = this.ohService.getPersonId();
    this.injuryId = this.ohService.getInjuryId();
    this.disabilityType = this.ohService.getDisabilityType();
    this.identifier = this.ohService.getIdentifier();
    this.isDatePassed = this.ohService.getAppealDate();
    this.disabilityAssessmentId = this.medicalboardAssessmentService.disabilityAssessmentId;
    this.isWithdraw = this.medicalboardAssessmentService.isWithdraw;
    this.isComplication = this.ohService.getIsComplication();
    this.complicationId = this.ohService.getComplicationId();
    this.injuryNumber = this.ohService.getInjuryNumber();
    this.isHoWorkItem = this.ohService.getIsHoWorkitem();
    this.gosiscp = this.authTokenService.getEntitlements();
    this.gosiscp[0].role.forEach(val => {
      if (RoleIdEnum.HEAD_OFFICE_DOCTOR.toString() === val.toString()) {
        this.isHeadOfficerLogin = true;
      }
    });
    if (this.isDatePassed) {
      this.gosiscp[0].role.forEach(roleid => {
        if (RoleIdEnum.BOARD_OFFICER.toString() === roleid.toString()) this.isDocumentUpload = true;
      });
    }
    if (this.isWithdraw) {
      this.gosiscp[0].role.forEach(roleid => {
        if (RoleIdEnum.BOARD_OFFICER.toString() === roleid.toString()) this.isDocumentUpload = true;
        if (RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString() === roleid.toString())
          this.isDocumentUpload = true;
        if (RoleIdEnum.HEAD_OFFICE_DOCTOR.toString() === roleid.toString()) this.isDocumentUpload = true;
      });
    }
    this.getDocumentCategory();
    this.setUser();
    console.log(this.routerDataToken);
    this.authenticationList = new LovList([
      { value: { english: 'OTP', arabic: '' }, sequence: 0, code: 10001 },
      { value: { english: 'Document', arabic: '' }, sequence: 1, code: 10002 }
    ]);
    // form to create radio button
    this.radioFormControl = this.fb.group({
      authMethod: this.fb.group({
        english: ['OTP', Validators.required],
        arabic: [null]
      })
    });
    this.otpForm = this.fb.group({ otp: [null, { validators: Validators.required }] });
    this.getAuthenticationDocList();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  hideCancelModal() {
    this.sessionStatusForm?.get('appealSessionForm')?.get('comments')?.reset();
    this.sessionStatusForm?.get('appealSessionForm')?.get('reason')?.reset();
    if (this.modalRef) this.modalRef.hide();
  }
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.disabilityAssessmentId).subscribe(res => {
      document = res;
      // document.uuid = this.uuid;
    });
  }
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  //Method to handle pagination logic
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.isAppPrivate && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  cancelTransaction() {
    this.alertService.clearAlerts;
    this.showModal(this.confirmTemplate);
  }
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
  decline() {
    this.modalRef.hide();
  }
  confirm() {
    this.modalRef.hide();
    if (this.isHoWorkItem) {
      this.location.back();
      // this.router.navigate([RouterConstants.ROUTE_INBOX]);
    } else {
      if (this.isComplication) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
        ]);
      } else
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
        ]);
      this.alertService.clearAlerts();
    }
  }
  showConfirmTemplate() {
    if (this.isHeadOfficerLogin) {
      this.saveDisabilityDescription();
    } else {
      const config = { backdrop: true, ignoreBackdropClick: true };
      if (this.isWithdraw) {
        this.heading = 'OCCUPATIONAL-HAZARD.CONFIRM-WITHDRAW-MESSAGE';
        this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
        // this.modalRef = this.modalService.show(this.confirmSubmit, config);
      } else if (this.ohService?.getStatusCode() === 1008 || this.ohService?.getStatusCode() === 1013) {
        this.heading = 'OCCUPATIONAL-HAZARD.CONFIRM.APPEAL.ACCEPT.MESSAGE';
        this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
      } else if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
        this.heading = 'OCCUPATIONAL-HAZARD.CONTRIBUTOR-APPEAL-MSG';
        this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
        // this.modalRef = this.modalService.show(this.confirmSubmitContributor, config);
      } else if (this.isMbo) {
        if (this.isDatePassed) {
          this.heading = 'OCCUPATIONAL-HAZARD.MBO-APPEAL-ASSESSMENT-MSG';
          this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
        } else {
          this.heading = 'OCCUPATIONAL-HAZARD.CONTRIBUTOR-APPEAL-MSG';
          this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
        }
      } else {
        this.heading = 'BENEFITS.CONFIRM-SUBMIT';
        this.modalRef = this.modalService.show(this.confirmSubmitMbo, config);
        // this.modalRef = this.modalService.show(this.confirmSubmit, config);
      }
    }
  }
  saveDisabilityDescription() {
    if (this.sessionStatusForm.invalid) {
      markFormGroupTouched(this.sessionStatusForm);
      this.alertService.showMandatoryErrorMessage();
      this.modalRef.hide();
      // if(this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
      //   this.TransactionTraceId.transactionTraceId = this.transactionNumber;
    } else if (this.isDocumentUpload) {
      // if (this.sessionStatusForm.valid)
      if (this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
        this.saveAppeal();
      } else {
        this.documentScanList.forEach((item: DocumentItem, index) => {
          item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
        });
        this.modalRef.hide();
        this.showMandatoryDocErrorMessage(true);
      }
    } else {
      this.saveAppeal();
    }
  }

  saveAppeal() {
    if (this.isHoDoctor || this.isHoWorkItem) {
      this.setHoTrue = true;
    }
    this.submitAssessment.comments = this.sessionStatusForm?.get('appealSessionForm')?.get('comments')?.value;
    this.submitAssessment.reasonForAppeal = this.sessionStatusForm?.get('appealSessionForm')?.get('reason')?.value;
    this.submitWithdraw.comments = this.sessionStatusForm?.get('appealSessionForm')?.get('comments')?.value;
    this.submitWithdraw.reasonForWithdrawAppeal = this.sessionStatusForm
      ?.get('appealSessionForm')
      ?.get('reason')?.value;
    if (this.isWithdraw) {
      this.medicalboardAssessmentService
        .withdrawAppeal(this.identifier, this.disabilityAssessmentId, this.submitWithdraw)
        .subscribe(
          res => {
            this.ohService.setAppealRoute(true);
            // this.alertService.showSuccess(res);
            this.successMessage = res;
            if (this.modalRef) this.modalRef.hide();
            // this.alertService.clearAlerts();
            if (this.isComplication) {
              this.router.navigate([
                `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
              ]);
              this.alertService.showSuccess(this.successMessage, null, 10);
            } else if (this.registrationNo && this.socialInsuranceNo && this.injuryId) {
              this.router.navigate([
                `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
              ]);
              this.alertService.showSuccess(this.successMessage, null, 10);
            } else {
              this.router.navigate([`home/medical-board/disability-assessment/view`]);
              this.alertService.showSuccess(this.successMessage, null, 10);
            }
          },
          err => this.showError(err)
        );

      // this.alertService.clearAlerts();
    } else if (this.isHoWorkItem) {
      if (this.modalRef) {
        this.modalRef.hide();
      }
      this.alertService.clearAlerts();
      const action = this.getWorkflowAction(3);
      // const data = this.setWorkflowData(this.routerDataToken, action);
      this.submitAppaelByHo(this.submitAssessment, this.routerDataToken, action);
      // this.router.navigate([RouterConstants.ROUTE_INBOX]);
      this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.APPEAL-SUCCESS-MESSAGE', 10);
    } else {
      this.medicalboardAssessmentService
        .submitAppealDetails(this.identifier, this.disabilityAssessmentId, this.submitAssessment, this.setHoTrue)
        .subscribe(
          res => {
            this.alertService.showSuccess(res.message);
            this.ohService.setAppealRoute(true);
            // this.successMessage = res.message;
            // else {
            this.modalRef.hide();
            if (this.isComplication) {
              this.router.navigate([
                `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
              ]);
              this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.APPEAL-SUCCESS-MESSAGE', 10);
            } else if (this.registrationNo && this.socialInsuranceNo && this.injuryId) {
              this.router.navigate([
                `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
              ]);
              this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.APPEAL-SUCCESS-MESSAGE', 10);
            } else {
              this.router.navigate([`home/medical-board/disability-assessment/view`]);
              this.alertService.showSuccess(res.message, null, 10);
            }
            // this.alertService.clearAlerts();
            // }
          },
          err => this.showError(err)
        );
    }
  }

  getDocumentCategory() {
    if (this.isWithdraw) {
      this.documentList$ = this.ohService.getReqDocsForWithdrawAppeal().pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
      this.documentList$.subscribe((documents: DocumentItem[]) =>
        documents.forEach(items => {
          if (items) {
            items.canDelete = true;
            this.documentCategoryList.push(items);
            this.documentScanList.push(items);
          }
        })
      );
    } else {
      this.documentList$ = this.ohService.getReqDocsForAppeal().pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
      this.documentList$.subscribe((documents: DocumentItem[]) =>
        documents.forEach(items => {
          if (items) {
            items.canDelete = true;
            this.documentCategoryList.push(items);
            this.documentScanList.push(items);
          }
        })
      );
    }
  }
  setUser() {
    const gosiscp = this.authTokenService.getEntitlements(); // to get login details from authToken
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isContributor = true;
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      gosiscp[0].role.forEach(roleid => {
        if (RoleIdEnum.BOARD_OFFICER.toString() === roleid.toString()) {
          this.isMbo = true;
        }
        if (RoleIdEnum.HEAD_OFFICE_DOCTOR.toString() === roleid.toString()) {
          this.isHoDoctor = true;
        }
        if (RoleIdEnum.CSR.toString() === roleid.toString()) {
          this.isCSR = true;
        }
        // else if (RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR.toString() === roleid.toString()) {
        //   this.isGosiDoctor = true;
        // }
      });
    }
  }
  /** Method to get workflow action. */
  getWorkflowAction(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
      case 2:
        action = WorkFlowActions.RETURN;
        break;
      case 3:
        action = WorkFlowActions.APPEAL;
        break;
    }
    return action;
  }

  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    // if (this.validatorMemberForm.get('rejectionReason'))
    //   datas.rejectionReason = this.validatorMemberForm.get('rejectionReason').value;
    // if (this.validatorMemberForm.get('returnReason'))
    //   datas.returnReason = this.validatorMemberForm.get('returnReason').value;
    // if (this.validatorMemberForm.get('comments')) datas.comments = this.validatorMemberForm.get('comments').value;
    datas.taskId = routerData.taskId;
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    return datas;
  }

  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: ContributorBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          // this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  cancelHold() {}
  confirmHold() {}
  // setUuid(isUploadSuccess) {
  //   if (isUploadSuccess) {
  //     this.docUploaded = true;
  //   }
  // }

  // deleteUuid(isDeletionSuccess) {
  //   if (isDeletionSuccess) {
  //     // this.docUploaded = false;
  //     this.uuid = null;
  //   }
  // }
  selectRadio(value) {
    value === 'OTP'
      ? ((this.showOTPField = true), (this.showDocumentField = false), this.removeAuthDocuments())
      : ((this.showDocumentField = true),
        this.getAuthenticationDocList(),
        (this.giveOTPData = false),
        (this.showOTPField = false));
  }
  removeAuthDocuments() {
    const declarationIndex = this.documentScanList.findIndex(
      val => val?.name?.english === 'Declaration Document' && val?.documentTypeId === 2043
    );
    if (declarationIndex !== -1) this.documentScanList.splice(declarationIndex, 1);
  }
  reSendOtp() {
    this.clearAlert();
    if (this.noOfIncorrectOtp === 3) {
      this.setError(this.MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.otpForm.get('otp').reset();
      this.generateOTP();
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
      this.medicalboardAssessmentService.getOTPValidation(this.identifier).subscribe(
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
  verifyOTP() {
    const otpValue = this.otpForm.get('otp').value;
    this.xOtp = this.uuid + ':' + otpValue;
    this.medicalboardAssessmentService.verifyOTP(this.identifier, this.xOtp).subscribe(
      data => {
        this.otpSuccess = data;
        if (data) {
          this.isValidOTP = true;
          this.giveOTPData = false;
          this.showOTPField = false;
          scrollToTop();
          // {
          //   english: 'OTP has been authenticated successfully',
          //   arabic: 'OTP has been authenticated successfully'
          // // }
          this.alertService.showSuccessByKey('MEDICAL-BOARD.OTP-AUTHENTICATION-SUCCESS');
        } else {
          this.isValidOTP = false;
        }
        // data ? (this.isValidOTP = true) : (this.isValidOTP = false);
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }
  getAuthenticationDocList() {
    this.docTransactionId = 'CONTINUE_WITH_ENTITLEMENT';
    this.documentList$ = this.ohService.getReqDocEarlyReassessment(this.docTransactionId, 'MEDICAL_BOARD').pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.documentList$.subscribe((documents: DocumentItem[]) => {
      this.authenticationDocList = [];
      documents.forEach(items => {
        if (items) {
          items.canDelete = true;
          items?.name.english === 'Declaration Document' && items?.documentTypeId === 2043
            ? (items.required = true)
            : (items.required = false);
          this.authenticationDocList.push(items);
        }
      });
    });
    if (this.showDocumentField && this.isDocumentUpload) {
      this.authenticationDocList.forEach(data => {
        this.documentScanList.push(data);
      });
    } else if (!this.showDocumentField && this.isDocumentUpload) {
      this.removeAuthDocuments();
    }
  }
  checkOtpDocValidation() {
    if (this.isCSR || this.isMbo) {
      // authentication should be mandatory
      if (this.sessionStatusForm.invalid) {
        markFormGroupTouched(this.sessionStatusForm);
        this.alertService.showMandatoryErrorMessage();
      } else if (this.showDocumentField && this.isDocumentUpload) {
        if (
          this.documentScanList.length > 0 &&
          this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)
        ) {
          this.showConfirmTemplate();
        } else {
          this.documentScanList.forEach((item: DocumentItem, index) => {
            item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
          });
          this.showMandatoryDocErrorMessage(true);
        }
      } else if (!this.isDocumentUpload && this.showDocumentField) {
        if (this.authenticationDocList.filter(item => item.required).every(doc => doc?.documentContent !== null)) {
          this.showConfirmTemplate();
        } else {
          this.authenticationDocList.forEach((item: DocumentItem, index) => {
            item?.required && item?.documentContent == null
              ? (this.authenticationDocList[index].uploadFailed = true)
              : null;
          });
          this.showMandatoryDocErrorMessage(true);
        }
      } else if (this.isDocumentUpload && this.isValidOTP) {
        if (
          this.documentScanList.length > 0 &&
          this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)
        ) {
          this.showConfirmTemplate();
        } else {
          this.documentScanList.forEach((item: DocumentItem, index) => {
            item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
          });
          this.showMandatoryDocErrorMessage(true);
        }
      } else if (this.isValidOTP && !this.isDocumentUpload) {
        this.showConfirmTemplate();
      } else {
        scrollToTop();
        this.alertService.clearAllErrorAlerts();
        this.alertService.showError(this.AuthenticationErrorMessage);
      }
    } else {
      //without authentiocation
      if (this.sessionStatusForm.invalid) {
        markFormGroupTouched(this.sessionStatusForm);
        this.alertService.showMandatoryErrorMessage();
      } else if (this.showDocumentField) {
        if (
          this.documentScanList.length > 0 &&
          this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null) &&
          this.sessionStatusForm.valid
        ) {
          this.showConfirmTemplate();
        } else {
          this.documentScanList.forEach((item: DocumentItem, index) => {
            item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
          });
          this.showMandatoryDocErrorMessage(true);
          markFormGroupTouched(this.sessionStatusForm);
          this.alertService.showMandatoryErrorMessage();
        }
      } else {
        this.showConfirmTemplate();
      }
    }
  }
  submitAppaelByHo(submitAssessment, data: RouterData, action) {
    // this.setWorkflowData(routerData,data)
    const workFlowData = this.saveAppealWorkFlow(submitAssessment, data, action);
    const parsedPayload = data.content;
    const additionalData = {
      arabicreasonForAppeal: this.submitAssessment.reasonForAppeal?.arabic,
      englishreasonForAppeal: this.submitAssessment.reasonForAppeal?.english,
      comments: this.submitAssessment.comments
    };
    const newPayload = this.modifyPayload(parsedPayload, additionalData);
    const modifiedPayload = {
      ...workFlowData,
      payload: {
        ...newPayload,
        Request: {
          ...newPayload.Request,
          Body: { ...newPayload.Request.Body, additionalData: additionalData }
        }
      },
      arabicreasonForAppeal: this.submitAssessment.reasonForAppeal?.arabic,
      englishreasonForAppeal: this.submitAssessment.reasonForAppeal?.english,
      comments: this.submitAssessment.comments
    };
    modifiedPayload.payload.TXNElement.Body.arabicreasonForAppeal = this.submitAssessment.reasonForAppeal?.arabic;
    modifiedPayload.payload.TXNElement.Body.englishreasonForAppeal = this.submitAssessment.reasonForAppeal?.english;
    modifiedPayload.payload.TXNElement.Body.comments = this.submitAssessment.comments;
    this.workflowService
      .mergeAndUpdateTask(modifiedPayload)
      .pipe(
        tap(data => {
          // this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  modifyPayload(originalPayload, additionalData) {
    return { ...originalPayload, ...additionalData };
  }
  saveAppealWorkFlow(submitAssessment: AppealReason, routerData: RouterData, action) {
    const workflowData = new OhBPMRequest();
    // const payload = JSON.parse(routerData.payload);
    workflowData.taskId = routerData.taskId;
    workflowData.user = routerData.assigneeId;
    workflowData.outcome = action;
    workflowData.comments = submitAssessment.comments;
    return workflowData;
  }
}
