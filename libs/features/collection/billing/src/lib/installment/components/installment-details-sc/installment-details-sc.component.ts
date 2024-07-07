/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  DocumentService,
  endOfMonth,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  startOfMonth,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject, noop, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InstallmentBaseScComponent } from '../../../shared/components/base/installment-base-sc.component';
import { BillingConstants, RouteConstants } from '../../../shared/constants';
import { OutOfMarketStatus } from '../../../shared/enums/out-of-market-status';
import { TransactionOutcome } from '../../../shared/enums/transaction-outcome';
import {
  InstallmentGuaranteeDetails,
  InstallmentPeriodDetails,
  InstallmentRequest,
  PaymentResponse
} from '../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  EstablishmentService,
  InstallmentService
} from '../../../shared/services';
import { EstablishmentOwnersWrapper } from '@gosi-ui/features/establishment/lib/shared/models';
import { RouterConstants } from '@gosi-ui/foundation-dashboard/lib/search/constants';
@Component({
  selector: 'blg-installment-details-sc',
  templateUrl: './installment-details-sc.component.html',
  styleUrls: ['./installment-details-sc.component.scss']
})
export class InstallmentDetailsScComponent extends InstallmentBaseScComponent implements OnInit {
  /**-----------------Local Variables-------------------- */
  isAppPublic: boolean;
  installmentId: number;
  installmentMainForm: FormGroup = new FormGroup({});
  paymentResponse: PaymentResponse = new PaymentResponse();
  paymentResponses: PaymentResponse = new PaymentResponse();
  periodOfInstallment = 0;
  successFlag = false;
  isOwnerOnJob = false;
  successMessage: BilingualText;
  totalInstallmentAmount = 0;
  extraAddedGrace: number;
  gracePeriod: number;
  installmentRequest: InstallmentRequest;
  isGuaranteeDisable = false;
  isDisabled = false;
  guaranteeStartDate: Date;
  guaranteeEndDate: Date;
  installmentStartDate: Date;
  userRoleArray: string[] = [];
  installmentEndDate: Date;
  isCollectionDeptMrg = false;
  establishmentOwnersWrap:EstablishmentOwnersWrapper;
  establishmentProfileUrl: string;
  /** Observables */
  guaranteeTypeBanking$: Observable<LovList>;
  guaranteeTypeOthersOutOfMarket$: Observable<LovList>;
  guaranteeTypeOthersRegistered$: Observable<LovList>;
  guaranteeTypePensionOutOfMarket$: Observable<LovList>;
  guaranteeTypePensionRegistered$: Observable<LovList>;
  guaranteeTypePromissoryNote$: Observable<LovList>;
  installmentGuaranteeType$: Observable<LovList>;
  saudiBank$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  @ViewChild('installmentWizard', { static: false }) /** Child components */
  installmentWizard: ProgressWizardDcComponent;
  /** Constants */
  documentTransactionId = BillingConstants.INSTALLMENT_DOCUMENT_TRANSACTION_ID;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly lookupService: LookupService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routingService: BillingRoutingService,
    readonly workflowService: WorkflowService,
    readonly installmentService: InstallmentService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly authTokenService: AuthTokenService
  ) {
    super(alertService, installmentService, documentService, contributionPaymentService);
  }
  // This method is used to initailise the task
  ngOnInit(): void {
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getLookUpDetails();
    this.checkUserRoles();
    this.checkEditMode();
    if (!this.inWorkflow) {
      this.regNumber = this.establishmentRegistrationNo.value;
      this.searchForEstablishment(this.regNumber);
      this.uuid = this.uuidGeneratorService.getUuid();
      this.showSearch = true;
    } else if (this.inWorkflow) {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.isGuaranteeDisable = payload.assignedRole === 'GDIC' ? true : false;
        this.regNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
        this.searchForEstablishment(this.regNumber);
        this.referenceNumber = payload.referenceNo;
        this.installmentId = payload.id ? Number(payload.id) : null;
        this.showSearch = false;
        this.getValidatorInstallmentDetails(this.regNumber, this.installmentId);
      }
    }
    this.fromHistory = false;
  }
  /** Method to get user role */
  checkUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleArray = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    if (!this.inWorkflow) {
      this.isCollectionDeptMrg =
        this.userRoleArray.indexOf(RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER.toString()) !== -1 ? true : false;
    }
  }
  /** Method to get lookup values. */
  getLookUpDetails() {
    this.installmentGuaranteeType$ = this.lookupService.getInstallmentGuaranteeTypeList();
    this.guaranteeTypeBanking$ = this.lookupService.getGuaranteetypeBankingList();
    this.guaranteeTypePensionRegistered$ = this.lookupService.getGuaranteetypePensionRegisteredList();
    this.guaranteeTypePensionOutOfMarket$ = this.lookupService.getGuaranteetypePensionOutOfMarketList();
    this.guaranteeTypeOthersRegistered$ = this.lookupService.getGuaranteetypeOtherRegisteredList();
    this.guaranteeTypeOthersOutOfMarket$ = this.lookupService.getGuaranteetypeOtherOutOfMarketList();
    this.guaranteeTypePromissoryNote$ = this.lookupService.getGuaranteetypePromissoryNoteList();
    this.saudiBank$ = this.sortLovList(this.lookupService.getSaudiBankList(), true);
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.getWizardDetails();
  }
  /*** This method is used to check edit mode*/
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res[0] && res[0].path === 'edit') this.inWorkflow = true;
    });
  }

  /*** This method is used to search establishment details.*/
  searchForEstablishment(regNumber: number) {
    if (regNumber !== null && regNumber !== undefined) {
      this.establishmentService.getEstablishment(regNumber).subscribe(
        establishment => {
          this.regNumber = establishment?.registrationNo;
          this.alertService.clearAlerts();
          this.establishmentDet = establishment;
          if (!this.inWorkflow) {
            if (this.getInstallmentPlan(regNumber)) {
              this.getActiveInstallments(regNumber);
            }
          }
          this.getintialInstallmentDetails(this.regNumber);
        },
        err => this.alertService.showError(err.error.message)
      );
    }
    this.getWizardDetails();
  }
  /*** This method is used to search establishment details.*/
  getValidatorInstallmentDetails(regNumber: number, intallmentId: number) {
    this.regNumber = regNumber;
    this.installmentService.getValidatorInstallmentDetails(regNumber, intallmentId).subscribe(
      res => {
        this.alertService.clearAlerts();
        this.installmentRequest = res;
        this.guarantee = this.installmentRequest?.guaranteeDetail[0]?.category?.english;
        this.guaranteeType = this.installmentRequest?.guaranteeDetail[0]?.type;
        this.getInstallmentDetails(this.regNumber);
        this.installmentAmount = this.installmentRequest?.monthlyInstallmentAmount;
        if (
          this.installmentRequest.guaranteeDetail &&
          this.installmentRequest.guaranteeDetail[0] &&
          this.installmentRequest.guaranteeDetail[0]?.category
        ) {
          this.guarantee = this.installmentRequest.guaranteeDetail[0]?.category?.english;
          this.guaranteeType = this.installmentRequest.guaranteeDetail[0]?.type;
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  /*** This method is used to navigate back to home page.*/
  navigateBack() {
    if (this.currentTab === 1 || this.currentTab === 2) this.previousForm();
    else {
      this.establishmentProfileUrl= RouterConstants.ROUTE_ESTABLISHMENT_PROFILE(
        this.regNumber
      );
      this.router.navigate([this.establishmentProfileUrl]);
      this.showSearch = true;
    }
  }
  /*** This method is used to get installemnt details*/
  getintialInstallmentDetails(regNumber: number) {
    this.installmentService.getInstallmentDetails(regNumber).subscribe(
      resp => {
        this.installmentDetails = resp;
        this.getPenaltyRequestStatus();
        this.getDownPaymentRequired();
        this.establishmentService.getOwnerDetails(regNumber).subscribe(res=>{
          this.establishmentOwnersWrap=res;
        });
      },
      err => this.showErrors(err)
    );
  }
  /*** This method is used to get installemnt details*/
  getInstallmentDetails(regNumber: number) {
    this.installmentService.getInstallmentDetails(regNumber, this.guaranteeType, this.guarantee).subscribe(
      resp => {
        this.outOfMarketFlag = resp.outOfMarket;
        this.installmentDetails = resp;
        this.getDownPaymentRequired();
        this.getPenaltyRequestStatus();
      },
      err => this.showErrors(err)
    );
  }
  /*** This method is used to get the guarantee and guarantee type*/
  getGuaranteeType() {
    this.modifiedInstallmentDetails.modifiedAmount = 0;
    this.modifiedInstallmentDetails.modifiedPeriod = 0;
    this.guarantee = this.installmentMainForm.get('guaranteeModeForm').get('category.english').value;
    this.guaranteeType = this.installmentMainForm.get('guaranteeTypeModeForm').get('guaranteeType').value;
    if (!this.isGuaranteeDisable) this.getInstallmentDetails(this.regNumber);
  }
  // Method to navigate to cancel
  navigateOnCancel() {
    if (this.inWorkflow) {
      this.installmentService.revertInstallmentDetails(this.regNumber, this.installmentId).subscribe(
        () => this.router.navigate(['home/billing/validator/installment']),
        err => this.alertService.showError(err.error.message)
      );
    } else this.router.navigate(['home']);
    this.alertService.clearAlerts();
  }

  saveAndNext() {
    markFormGroupTouched(this.installmentMainForm);
    if (this.verifyGuaranteeDetails()) {
      if (this.isdownPaymentEnabled && this.downPayment === 0) this.alertService.showMandatoryErrorMessage();
      else if (this.isdownPaymentEnabled && this.downPaymentPercentage < 50 && this.guarantee === 'Other' && this.guaranteeType?.english !== 'Special Request') {
        this.alertService.showErrorByKey('BILLING.DOWN-PAYMENT-RATIO-LESS-THAN-ERROR');
        scrollToTop();
      } 
      else if (this.guaranteeType.english === 'Special Request' && this.isdownPaymentEnabled && this.status === undefined) this.alertService.showMandatoryErrorMessage();
      else if (this.guaranteeType.english === 'Special Request' && this.isdownPaymentEnabled && this.status?.english !== "No" && this.SpecialGuaranteeType?.english === undefined) this.alertService.showMandatoryErrorMessage();
        else if (this.guaranteeType.english === 'Special Request' && this.isdownPaymentEnabled && this.status?.english !== "No" && this.guaranteePercentage === undefined)  this.alertService.showMandatoryErrorMessage();      
       else if(this.guaranteeType.english === 'Special Request' && this.isdownPaymentEnabled && this.status?.english !== "No" && (this.guaranteePercentage < 1 || this.guaranteePercentage > 99)) 
       this.alertService.showErrorByKey('BILLING.GUARANTEE-PERCENTAGE-ERROR');
      
        else if (this.installmentMainForm.valid) {
        this.createFormData();
        scrollToTop();
        this.alertService.clearAlerts();
        this.currentTab = 1;
        this.nextForm();
      } else this.alertService.showMandatoryErrorMessage();
    }
  }
  // Method to submit installment details
  submitInstallmentDetails() {
    if (
      this.installmentMainForm &&
      this.installmentMainForm.get('commentsForm') &&
      this.installmentMainForm.get('commentsForm').get('comments')
    )
      this.installmentSubmitRequest.comments = this.installmentMainForm.get('commentsForm').get('comments').value;
    this.installmentSubmitRequest.uuid = this.uuid;
    if (this.checkInstallmentDocuments()) {
      if (!this.inWorkflow) {
        this.installmentService
          .submitInstallmentDetails(this.regNumber, this.installmentSubmitRequest)
          .pipe(
            tap(res => {
              this.alertService.clearAlerts();
              this.paymentResponse.fromJsonToObject(res);
              this.successMessage = this.paymentResponse.message; //Setting success message
              this.isDisabled = true;
              if (this.successMessage) {
                this.successFlag = true;
                this.showSearch = true;
                this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.regNumber)]);
              }
              this.alertService.showSuccess(this.successMessage, null, 10);
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);      
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
      if (this.inWorkflow) {
        this.installmentService
          .updateInstallmentDetails(this.regNumber, this.installmentSubmitRequest, this.installmentId)
          .pipe(
            tap(res => {
              if (this.isGuaranteeDisable) {
                this.alertService.showSuccessByKey(BillingConstants.TRANSACTION_APPROVED, null, 5);
              } else {
                this.paymentResponses.fromJsonToObject(res);
                this.successMessage = this.paymentResponses.message; //Setting success message
                this.alertService.showSuccess(this.successMessage, null, 10);
              }
              this.handleWorkflow();
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    } else {
      this.isDisabled = false;
      this.alertService.showMandatoryDocumentsError();
      
    }
  }
  // Method to update actions after gdic edit submit
  handleWorkflow() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerData.taskId;
    bpmUpdateRequest.user = this.routerData.assigneeId;
    if (this.isGuaranteeDisable) bpmUpdateRequest.outcome = TransactionOutcome.APPROVE;
    bpmUpdateRequest.commentScope = 'BPM';
    bpmUpdateRequest.comments = this.installmentMainForm.get('commentsForm').get('comments').value;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
      () => this.routingService.navigateToPublicInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
  /** Method to check validaity of documents scanned */
  checkInstallmentDocuments() {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }
  // * Method to create form data
  createFormData() {
    this.installmentDetailsReq = bindToObject(
      new InstallmentGuaranteeDetails(),
      this.installmentMainForm.get('guaranteeModeForm').value
    );
    if (this.installmentMainForm && this.installmentMainForm.get('guaranteeTypeModeForm'))
      this.installmentDetailsReq.type = this.guaranteeType = this.installmentMainForm
        .get('guaranteeTypeModeForm')
        .get('guaranteeType').value;
    if (this.guarantee === 'Bank Guarantee') {
      this.installmentDetailsReq.guaranteeName = this.installmentMainForm.get('bankingTypeForm.guaranteeName').value;
      this.installmentDetailsReq.guarantorId = Number(
        this.installmentMainForm.get('bankingTypeForm.guarantorId').value
      );
      this.installmentDetailsReq.endDate.gregorian = startOfDay(
        this.installmentMainForm.get('bankingTypeForm.endDate.gregorian').value
      );
      this.installmentDetailsReq.endDate.hijiri = this.installmentMainForm.get('bankingTypeForm.endDate.hijiri').value;
      this.installmentDetailsReq.startDate.gregorian = startOfDay(
        this.installmentMainForm.get('bankingTypeForm.startDate.gregorian').value
      );
      this.installmentDetailsReq.startDate.hijiri = this.installmentMainForm.get(
        'bankingTypeForm.startDate.hijiri'
      ).value;
      this.installmentDetailsReq.guaranteeAmount = Number(
        this.installmentMainForm.get('bankingTypeForm.guaranteeAmount').value
      );
    }
    if (this.guarantee === 'Promissory Note') {
      if (this.installmentMainForm.get('promissoryTypeForm.guaranteeName'))
        this.installmentDetailsReq.guaranteeName = this.installmentMainForm.get(
          'promissoryTypeForm.guaranteeName'
        ).value;
      this.installmentDetailsReq.guaranteeName.arabic = '';
      if (this.installmentMainForm.get('promissoryTypeForm.guarantorId'))
        this.installmentDetailsReq.guarantorId = Number(
          this.installmentMainForm.get('promissoryTypeForm.guarantorId').value
        );
      if (this.installmentMainForm.get('promissoryTypeForm.endDate'))
        this.installmentDetailsReq.endDate.gregorian = this.installmentMainForm.get(
          'promissoryTypeForm.endDate.gregorian'
        ).value;
      this.installmentDetailsReq.endDate.hijiri = this.installmentMainForm.get(
        'promissoryTypeForm.endDate.hijiri'
      ).value;
      if (this.installmentMainForm.get('promissoryTypeForm.startDate'))
        this.installmentDetailsReq.startDate.gregorian = startOfDay(
          this.installmentMainForm.get('promissoryTypeForm.startDate.gregorian').value
        );
      this.installmentDetailsReq.startDate.hijiri = this.installmentMainForm.get(
        'promissoryTypeForm.startDate.hijiri'
      ).value;
      if (this.installmentMainForm.get('promissoryTypeForm.guaranteeAmount'))
        this.installmentDetailsReq.guaranteeAmount = Number(
          this.installmentMainForm.get('promissoryTypeForm.guaranteeAmount').value
        );
    }
    if (this.guarantee === 'Pension') {
      this.installmentDetailsReq.guaranteeName = this.installmentMainForm.get('pensionTypeForm.guaranteeName').value;
      this.installmentDetailsReq.guarantorId = this.installmentMainForm.get('pensionTypeForm.guarantorId').value;
      this.installmentAmount = this.modifiedInstallmentDetails.modifiedAmount = this.installmentMainForm.get(
        'pensionTypeForm.installmentAmount'
      ).value;
      this.installmentDetailsReq.guaranteeAmount = this.amount = Number(
        this.installmentMainForm.get('pensionTypeForm.amount').value
      );
    }
    if (this.guarantee === 'Other') {
      if (this.guaranteeType && this.guaranteeType?.english === 'Establishment owner is on a job') {
        this.isOwnerOnJob = true;
        this.installmentDetailsReq.guaranteeAmount = this.amount = Number(
          this.installmentMainForm.get('otherTypeForm.amount').value
        );
        this.installmentAmount = Number(this.installmentMainForm.get('otherTypeForm.installmentAmount').value);
      } else if (this.guaranteeType?.english === OutOfMarketStatus.DECEASED_NO_INCOME) {
        this.isOwnerOnJob = false;
        this.installmentDetailsReq.deathDate.gregorian = this.installmentMainForm.get(
          'otherTypeForm.deathDate.gregorian'
        ).value;
      }
    }
    if (this.isdownPayment || this.isdownPaymentEnabled || this.isGuaranteeDisable) {
      this.installmentSubmitRequest.downPaymentPercentage = this.downPaymentPercentage;
      this.installmentSubmitRequest.downPayment = this.downPayment;
      if (this.extraAddedGrace !== undefined) {
        this.installmentSubmitRequest.extensionReason = this.reason;
        this.installmentSubmitRequest.extendedGracePeriod = this.extraAddedGrace;
        this.installmentSubmitRequest.gracePeriod = 7;
      } else {
        this.installmentSubmitRequest.gracePeriod = 7;
        this.installmentSubmitRequest.extensionReason = null;
        this.installmentSubmitRequest.extendedGracePeriod = 0;
      }
    } else {
      this.installmentSubmitRequest.downPaymentPercentage = 0;
      this.installmentSubmitRequest.gracePeriod = 0;
      this.installmentSubmitRequest.extensionReason = null;
      this.installmentSubmitRequest.extendedGracePeriod = 0;
    }
    this.installmentSubmitRequest.guaranteeDetail = [];
    this.installmentSubmitRequest.guaranteeDetail.push(this.installmentDetailsReq);
    if(this.installmentSubmitRequest?.guaranteeDetail[0]?.type?.english === 'Special Request')
    this.installmentSubmitRequest.guaranteeStatus = this.status;
    if(this.installmentSubmitRequest?.guaranteeStatus?.english === 'Yes'){
    this.installmentSubmitRequest.guaranteePercentage = this.guaranteePercentage;
    this.installmentSubmitRequest.specialGuaranteeType = this.SpecialGuaranteeType;
    }
  }
  // Method to save installment details
  save(installmentPeriodDetails: InstallmentPeriodDetails) {
    this.installmentSubmitRequest.startDate.gregorian = startOfDay(installmentPeriodDetails.startDate);
    this.installmentSubmitRequest.endDate.gregorian = endOfMonth(installmentPeriodDetails.endDate);
    this.installmentSubmitRequest.installmentPeriodInMonths = installmentPeriodDetails.periodOfInstallment;
    if (!this.isGuaranteeDisable && this.installmentDetails?.installmentPlan)
      this.installmentDetails.installmentPlan[0].guaranteeDetail[0].terms[0].maxInstallmentPeriodInMonths =
        installmentPeriodDetails.periodOfInstallment;
    this.installmentSubmitRequest.lastInstallmentAmount = installmentPeriodDetails.lastInstallmentAmount;
    this.installmentSubmitRequest.monthlyInstallmentAmount = installmentPeriodDetails.monthlyInstallmentAmount;
    this.installmentStartDate = startOfDay(this.installmentSubmitRequest.startDate.gregorian);
    this.installmentEndDate = startOfDay(this.installmentSubmitRequest.endDate.gregorian);
    this.guaranteeEndDate = startOfDay(this.installmentDetailsReq.endDate.gregorian);
    this.guaranteeStartDate = startOfDay(this.installmentDetailsReq.startDate.gregorian);
    if (
      this.guarantee === 'Bank Guarantee' &&
      startOfMonth(this.guaranteeEndDate) <= startOfMonth(this.installmentEndDate)
    )
      this.alertService.showErrorByKey('BILLING.BANKING-END-DATE-ERROR');
    else if (
      this.guarantee === 'Bank Guarantee' &&
      startOfMonth(this.guaranteeStartDate) >= startOfMonth(this.installmentStartDate)
    )
      this.alertService.showErrorByKey('BILLING.BANKING-START-DATE-ERROR');
    else if (
      this.guarantee === 'Promissory Note' &&
      startOfMonth(this.guaranteeEndDate) <= startOfMonth(this.installmentEndDate)
    )
      this.alertService.showErrorByKey('BILLING.PROMISORY-END-DATE-ERROR');
    else if (
      this.guarantee === 'Promissory Note' &&
      startOfMonth(this.guaranteeStartDate) >= startOfMonth(this.installmentStartDate)
    )
      this.alertService.showErrorByKey('BILLING.PROMISORY-START-DATE-ERROR');
    else if (
      this.guarantee === 'Bank Guarantee' &&
      this.guaranteeEndDate <= this.installmentEndDate &&
      this.guaranteeStartDate <= this.installmentStartDate
    )
      this.alertService.showErrorByKey('BILLING.BANKING-END-DATE-ERROR');
    else if (
      this.guarantee === 'Promissory Note' &&
      this.guaranteeEndDate <= this.installmentEndDate &&
      this.guaranteeStartDate <= this.installmentStartDate
    )
      this.alertService.showErrorByKey('BILLING.PROMISORY-END-DATE-ERROR');
    else if (this.installmentSubmitRequest?.lastInstallmentAmount) {
      this.checkLastInstallmentAmount()
      if(this.enableSubmit){
        this.submitInstallmentDetails();
        this.isDisabled = true;
      }
    } else {
      this.checkLastInstallmentAmount();
      if(this.enableSubmit){
        this.submitInstallmentDetails();
        this.isDisabled = true;
      }
    }
  }
}
