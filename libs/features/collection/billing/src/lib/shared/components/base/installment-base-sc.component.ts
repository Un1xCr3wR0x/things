import { Directive, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  AlertService,
  WizardItem,
  BilingualText,
  scrollToTop,
  LovList,
  DocumentItem,
  DocumentService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { noop, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BillingConstants } from '../../constants';
import { ReceiptApprovalStatus } from '../../enums';
import { InstallmentGuaranteeTypes } from '../../enums/installment-guarantee-types';
import { OutOfMarketStatus } from '../../enums/out-of-market-status';
import {
  EstablishmentDetails,
  InstallmentDetails,
  InstallmentGuaranteeDetails,
  InstallmentRequest,
  InstallmentSummary,
  PreviousInstallment
} from '../../models';
import { ContributionPaymentService, InstallmentService } from '../../services';

@Directive()
export abstract class InstallmentBaseScComponent implements OnInit {
  /*
   * Local variables
   */
  currentTab = 0;
  inWorkflow = false;
  regNumber: number;
  installmentWizardItems: WizardItem[] = [];
  installmentDetails: InstallmentDetails = new InstallmentDetails();
  establishmentDet: EstablishmentDetails;
  installmentDetailsReq: InstallmentGuaranteeDetails;
  isdownPayment = false;
  modifiedInstallmentDetails = {
    modifiedAmount: 0,
    modifiedPeriod: 0
  };
  amount = 0;
  installmentAmount = 0;
  downPayment = 0;
  status: BilingualText;
  isValid = false;
  lang = 'en';
  downPaymentPercentage: number;
  guarantee: string;
  installmentSummary: InstallmentSummary;
  guaranteeType: BilingualText = new BilingualText();
  outOfMarketFlag: boolean;
  previousInstallment: PreviousInstallment[];
  previousActiveInstallments: PreviousInstallment[];
  previousNewInstallments: PreviousInstallment[];
  approvalInProgressInstallments: PreviousInstallment[];
  waitingForPaymentInstallments: PreviousInstallment[];
  showSearch = false;
  isactiveInstallmentPresent = true;
  transactionId: string;
  transactionType: string;
  isdownPaymentEnabled = false;
  installmentSubmitRequest: InstallmentRequest = new InstallmentRequest();
  installmentFlag = false;
  isInstallmentChangeRequest = false;
  extraAddedGrace: number;
  gracePeriod: number;
  isGuaranteeSelected = false;
  reason: string;
  isAppPublic: boolean;
  specialRequestFlag:boolean;
  /**Document upload */
  documents: DocumentItem[] = [];
  referenceNumber: number;
  uuid: string;
  @ViewChild('installmentWizard', { static: false }) /** Child components */
  installmentWizard: ProgressWizardDcComponent;
  enableSubmit = false;
  guaranteePercentage: number;
  SpecialGuaranteeType: BilingualText;
  fromHistory = false;

  /**
   *
   * @param alertService
   */
  constructor(
    readonly alertService: AlertService,
    readonly installmentService: InstallmentService,
    readonly documentService: DocumentService,
    readonly contributionPaymentService: ContributionPaymentService
  ) {}

  ngOnInit(): void {}
  /*
   * Method to set installment error messages
   */
  /** Method to initialize the navigation wizard. */
  getWizardDetails() {
    this.installmentWizardItems = [];
    this.installmentWizardItems.push(new WizardItem(BillingConstants.GUARANTEE, 'award'));
    this.installmentWizardItems.push(new WizardItem(BillingConstants.INSTALLMENT_DETAILS, 'calendar-alt'));
    if(!this.isAppPublic) {
      this.installmentWizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    }
    this.installmentWizardItems[0].isDisabled = false;
    this.installmentWizardItems[0].isActive = true;
  }
  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  verifyGuaranteeDetails(): boolean {
    const minimumDueToAllowInstallment = 3000;
    if (this.installmentDetails && this.installmentDetails.dueAmount) {
      if (this.installmentDetails.dueAmount.total === 0) {
        this.alertService.showErrorByKey('BILLING.NO-DUE-ERROR');
        return false;
      } else if (this.installmentDetails.dueAmount?.total < minimumDueToAllowInstallment) {
        this.alertService.showErrorByKey('BILLING.DUE-LESS-ERROR');
        return false;
      } else if (this.installmentDetails.dueAmount?.total >= minimumDueToAllowInstallment) {
        if (
          (this.isdownPayment || this.isdownPaymentEnabled) &&
          this.installmentDetails.dueAmount?.total - this.downPayment < minimumDueToAllowInstallment
        ) {
          this.alertService.showErrorByKey('BILLING.DUE-LESS-DOWNPAYMENT-ERROR');
          return false;
        } else return true;
      }
      return false;
    }
  }
  /**
   * MEthod to get penalty waiver request
   */
  getPenaltyRequestStatus() {
    if (this.installmentFlag) {
      if (this.installmentDetails.penaltyWaiverInWorkflow) {
        this.showSearch = true;
        this.alertService.showErrorByKey('BILLING.PENALTY-REQUEST-WORKFLOW');
      } else if (!this.isactiveInstallmentPresent) this.showSearch = false;
      else this.showSearch = true;
    } else return false;
  }
  /*
   * Method to get active installments
   */
  getActiveInstallments(regNumber: number) {
    this.installmentService.getInstallmentactive(regNumber, false).subscribe(
      res => {
        this.previousInstallment = res['installmentDetails'];
        this.previousActiveInstallments = this.previousInstallment.filter(
          value => value?.status?.english === ReceiptApprovalStatus.ACTIVE
        );
        this.previousNewInstallments = this.previousInstallment.filter(
          value => value?.status?.english === ReceiptApprovalStatus.NEW
        );
        this.approvalInProgressInstallments = this.previousInstallment.filter(
          value => value?.status?.english === ReceiptApprovalStatus.APPROVAL_IN_PROGRESS
        );
        this.waitingForPaymentInstallments = this.previousInstallment.filter(
          value => value?.status?.english === ReceiptApprovalStatus.WAITING_FOR_DOWN_PAYMENT
        );
        if (
          this.previousActiveInstallments?.length === 0 &&
          this.previousNewInstallments?.length === 0 &&
          this.approvalInProgressInstallments?.length === 0 &&
          this.waitingForPaymentInstallments?.length === 0 &&
          this.isInstallmentChangeRequest
        ) {
          this.isactiveInstallmentPresent = false;
          return true;
        } else if (this.previousActiveInstallments?.length > 0) {
          this.showSearch = true;
          this.alertService.showErrorByKey('BILLING.INTALLMENT-ACTIVE-ERROR');
          return false;
        } else if (
          this.previousNewInstallments?.length > 0 ||
          this.approvalInProgressInstallments?.length > 0 ||
          this.waitingForPaymentInstallments?.length > 0
        ) {
          this.showSearch = true;
          if(this.waitingForPaymentInstallments?.length > 0){
            this.alertService.showErrorByKey('BILLING.INTALLMENT-DOWNPAYMENT-ERROR');
          } else {
            this.alertService.showErrorByKey('BILLING.INTALLMENT-NEW-ERROR');
          }
          return false;
        }
      },
      err => {
        if (err?.error?.message?.english === 'No records found.') {
          this.isactiveInstallmentPresent = false;
          return true;
        } else {
          this.showSearch = true;
          this.alertService.showError(err.error.message);
          return false;
        }
      }
    );
    return true;
  }
  /**
   * Method to get installmment plan details
   * @param regNumber
   */
  getInstallmentPlan(regNumber: number) {
    this.installmentFlag = true;
    if(!this.isAppPublic){
    if (this.establishmentDet?.status?.english === ReceiptApprovalStatus.REGISTERED || this.establishmentDet?.status?.english === BillingConstants.REOPENED_STATUS || this.establishmentDet?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS) {
      this.contributionPaymentService.getWorkFlowStatus(regNumber).subscribe(res => {
        if (res?.length === 0) {
          this.isInstallmentChangeRequest = true;
          this.installmentFlag = true;
        } else {
          this.installmentFlag = this.getChangeRequestStatus(res);
        }
      });
    } 
  } else if (this.establishmentDet?.status?.english === ReceiptApprovalStatus.REGISTERED || this.establishmentDet?.status?.english === BillingConstants.REOPENED_STATUS) {
    this.contributionPaymentService.getWorkFlowStatus(regNumber).subscribe(res => {
      if (res?.length === 0) {
        this.isInstallmentChangeRequest = true;
        this.installmentFlag = true;
      } else {
        this.installmentFlag = this.getChangeRequestStatus(res);
      }
    });
  } 
    else {
      this.showSearch = true;
      this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
      this.installmentFlag = false;
    }
    return this.installmentFlag;
  }
  /**
   * Method to get change request
   * @param res
   */
  getChangeRequestStatus(res) {
    return res.forEach(value => {
      if (value) {
        if (value.type === BillingConstants.LEGAL_ENTITY_CHANGE) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-LEGAL-ENTITY');
          this.showSearch = true;
          return false;
        } else if (value.type === BillingConstants.DELINK_BRANCH_CHANGE) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-DELINK');
          this.showSearch = true;
          return false;
        } else if (value.type === BillingConstants.CHANGE_OWNER) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
          this.showSearch = true;
          return false;
        } else {
          this.isInstallmentChangeRequest = true;
          this.showSearch = false;
          return true;
        }
      } else return true;
    });
  }
  /* Method to check form validity */
  checkFormValidity(form: AbstractControl) {
    if (form) return form.valid;
    return false;
  }
  /** Method to set DownPayment Amount*/
  setDownPaymentAmount(amount: number) {
    this.downPayment = amount;
  }
  getguaranteeStatus(status: BilingualText){
    this.status = status;
  }
  getguaranteePercentage(amount: number){
    this.guaranteePercentage = amount;
  }
  getguaranteeType(value: BilingualText){
    this.SpecialGuaranteeType = value;
  }
  /** Method to get DownPayment Amount*/
  getDownPaymentRequired() {
    this.installmentDetails?.installmentPlan?.forEach(res => {
      res.guaranteeDetail.forEach(resp => {
        resp.terms.forEach(val => {
          if (!this.inWorkflow) this.isdownPayment = val.downPaymentRequired;
        });
      });
    });
  }
  /** Method to set DownPayment percentage*/
  getDownPercentage(percentage: number) {
    this.downPaymentPercentage = percentage;
  }
  /*** This method is set document parameters.*/
  setDocumentParameters() {
    if (this.guarantee === 'Bank Guarantee') {
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.BANK_GUARANTEE;
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.BANK_GUARANTEE_CASE_GOL;
      }
    } else if (this.guarantee === 'Promissory Note') {
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.PROMISSORY_NOTE;
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PROMISSORY_NOTE_CASE_GOL;
      }
    } else if (this.guarantee === 'Pension' && this.outOfMarketFlag) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PENSION_CLOSED_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType =
          this.guaranteeType.english === InstallmentGuaranteeTypes.EST_OWNER_HAS_PENSION_PPA
            ? BillingConstants.PPA_PENSION_CLOSED
            : BillingConstants.PENSION_CLOSED;
      }
    } else if (this.guarantee === 'Pension' && !this.outOfMarketFlag) {
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.PENSION_REGISTERED;
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PENSION_REGISTERED_CASE_GOL;
      }
    } else if (this.guarantee === 'Other' && !this.outOfMarketFlag && this.guaranteeType?.english === 'No Guarantee') {
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE;
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE_CASE_GOL;
      }
    }
    else if (
      this.guarantee === 'Other' &&
      this.outOfMarketFlag &&
      this.guaranteeType?.english === 'Establishment owner is on a job'
    ) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB;
      }
    }  else if ((this.guarantee === 'Other' && this.guaranteeType?.english === 'Special Request') || this.fromHistory === true){
      if (this.status?.english ==='Yes' && this.SpecialGuaranteeType?.english === 'Bank Guarantee'){
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.BANKGUARANTEE_SPECIAL_REQUEST;
      } else if ((this.status?.english ==='Yes' && this.SpecialGuaranteeType?.english === 'Promissory Note')){
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PROMISSORY_NOTE_SPECIAL_REQUEST;
      }
     else {
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.SPECIAL_REQUEST;
      }  
  }
     else if (
      this.guarantee === 'Other' &&
      this.outOfMarketFlag &&
      this.guaranteeType.english === OutOfMarketStatus.DECEASED_NO_INCOME
    ) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.DECEASED_CLOSED_EST_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.DECEASED_CLOSED_EST;
      }
    }
    if (this.installmentDetails && this.installmentDetails?.installmentPlan?.length > 0) {
      this.installmentDetails.installmentPlan.forEach(res => {
        res.guaranteeDetail.forEach(val => {
          val.terms.forEach(evt => {
            this.setExceptionDocumentParameter(
              this.installmentSubmitRequest.installmentPeriodInMonths,
              evt.eligibleForIncreasingMaxInstallPeriod
            );
          });
        });
      });
    } else if (this.installmentSummary?.installmentPeriodInMonths) {
      this.setExceptionDocumentParameter(this.installmentSummary?.installmentPeriodInMonths, true);
    }
    if(!this.isAppPublic && this.outOfMarketFlag){
      this.transactionId = BillingConstants.INSTALLMENT;
      this.transactionType = BillingConstants.DECEASED_CLOSED_EST;
    }
  }
  setExceptionDocumentParameter(installmentPeriodInMonths: number, eligibleForIncreasingMaxInstallPeriod: boolean) {
    if (
      this.guarantee === 'Bank Guarantee' &&
      eligibleForIncreasingMaxInstallPeriod &&
      installmentPeriodInMonths > 30
    ) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL_CASE_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL;
      }
    } else if (
      this.guarantee === 'Promissory Note' &&
      eligibleForIncreasingMaxInstallPeriod &&
      installmentPeriodInMonths > 30
    ) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE;
      }
    } else if (this.guarantee === 'Other' && eligibleForIncreasingMaxInstallPeriod && installmentPeriodInMonths > 30) {
      if (this.isAppPublic) {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL_CASE_GOL;
      } else {
        this.transactionId = BillingConstants.INSTALLMENT;
        this.transactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL;
      }
    }
  }
  /**
   * Method to get downpayment amount
   * @param isdownPaymentEnabled
   */
  getDownPayment(isdownPaymentEnabled) {
    this.isdownPaymentEnabled = this.isdownPayment = isdownPaymentEnabled;
    if (isdownPaymentEnabled) this.installmentSubmitRequest.gracePeriod = 7;
    else this.installmentSubmitRequest.gracePeriod = 0;
  }
  /** Method to get extended values*/
  getExtendedValues(params) {
    this.extraAddedGrace = params.extraGracePeriod;
    this.reason = params.extensionreason;
    this.gracePeriod = params.gracePeriod;
  }
  getGaranteeselected(res) {
    this.isGuaranteeSelected = res;
  }
  /** Method to show error alerts. */
  showErrors(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  /** Method to navigate back to next section. */
  nextForm() {
    scrollToTop();
    this.alertService.clearAlerts();
    if (this.installmentWizard) this.installmentWizard.setNextItem(this.currentTab);
  }
  /** Method to navigate back to previous section. */
  previousForm() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.installmentWizard.setNextItem(this.currentTab);
  }
  /*** Methpd to sort lov list.*/
  sortLovList(list: Observable<LovList>, isBank: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.contributionPaymentService.sortLovList(res, isBank, this.lang);
          }
        })
      );
    }
  }
  setModifiedInstallmentDetails(details) {
    this.installmentAmount = this.modifiedInstallmentDetails.modifiedAmount = details?.modifiedAmount;
    this.modifiedInstallmentDetails.modifiedPeriod = details?.modifiedPeriod;
  }
  /*******************************Documenet Scan********************************************** */
  // Method to perform refresh the documents after scanning.
  refreshDocuments(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.regNumber,
          this.transactionId,
          this.transactionType,
          this.inWorkflow ? this.referenceNumber : null,
          null,
          !this.inWorkflow ? this.uuid : null
        )
        .pipe(
          tap(res => {
            document = res;
          }),
          catchError(err => {
            this.showErrors(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /*** This method is get documents*/
  getDocuments() {
    this.documentService
      .getDocuments(this.transactionId, this.transactionType, this.regNumber, this.referenceNumber)
      .subscribe(res => {
        this.documents = res;
        this.documents.forEach(doc => {
          this.refreshDocuments(doc);
        });
      });
  }
  checkLastInstallmentAmount() {
    if (
      this.guaranteeType.english === OutOfMarketStatus.DECEASED_NO_INCOME &&
      this.installmentSubmitRequest.lastInstallmentAmount < 500
    )
      this.alertService.showErrorByKey('BILLING.LAST-INSTALLMENT-AMOUNT-ERROR', { amount: 500 });
    else if (
      (this.guarantee === 'Pension' || this.guaranteeType.english === OutOfMarketStatus.EST_OWNER_ON_JOB) &&
      this.installmentSubmitRequest.lastInstallmentAmount <
        Math.round(
          (Number((this.installmentSubmitRequest?.guaranteeDetail[0]?.guaranteeAmount * 25) / 100) + Number.EPSILON) *
            100
        ) /
          100
    )
      this.alertService.showErrorByKey('BILLING.LAST-INSTALLMENT-AMOUNT-ERROR', {
        amount:
          Math.round(
            (Number((this.installmentSubmitRequest?.guaranteeDetail[0]?.guaranteeAmount * 25) / 100) + Number.EPSILON) *
              100
          ) / 100
      });
    else if (
      this.guaranteeType.english !== OutOfMarketStatus.EST_OWNER_ON_JOB &&
      this.installmentDetails?.installmentPlan &&
      this.installmentSubmitRequest.lastInstallmentAmount <
        this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount
    )
      this.alertService.showErrorByKey('BILLING.LAST-INSTALLMENT-AMOUNT-ERROR', {
        amount: this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount
      });
    else {
      if(this.isAppPublic){
        this.enableSubmit = true;
      } else {
        this.setDocumentParameters();
        if (!this.inWorkflow) this.getRequiredDocuments(this.transactionId, this.transactionType);
        else if (this.inWorkflow) this.getDocuments();
        this.currentTab = 2;
        this.installmentWizard.setNextItem(this.currentTab);
      }
    }
  }
  //Method to fetch the required document for scanning.
  getRequiredDocuments(transactionId: string, transactionType: string) {
    this.documentService
      .getRequiredDocuments(transactionId, transactionType)
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error))
      )
      .subscribe(res => {
        this.documents = res;
        this.documents.forEach(doc => {
          this.refreshDocuments(doc);
        });
      });
  }
}
