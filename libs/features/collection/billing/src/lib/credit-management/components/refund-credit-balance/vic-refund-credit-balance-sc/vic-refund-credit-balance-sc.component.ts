import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  ContributorStatus,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  Role,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets/progress-wizard-dc/progress-wizard-dc.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { VicRefundCreditBalanceBaseScComponent } from '../../../../shared/components/base/vic-refund-credit-balance-base-sc.component';
import { BillingConstants } from '../../../../shared/constants';
import {
  ChangeRequest,
  CreditBalanceDetails,
  CreditRefundRequest,
  PaymentResponse,
  PersonRequest,
  VicContributorDetails
} from '../../../../shared/models';
import { BillingRoutingService, CreditManagementService } from '../../../../shared/services';
import { Location } from '@angular/common';
import { IbanModification } from '../../../../shared/enums';
@Component({
  selector: 'blg-vic-refund-credit-balance-sc',
  templateUrl: './vic-refund-credit-balance-sc.component.html',
  styleUrls: ['./vic-refund-credit-balance-sc.component.scss']
})
export class VicRefundCreditBalanceScComponent extends VicRefundCreditBalanceBaseScComponent implements OnInit {
  //Local Variables
  bankName: BilingualText;
  workflowFlag = false;
  documentList: DocumentItem[] = [];
  isIbanEdit: boolean;
  ibanNumber = '';
  isAppPrivate: boolean;
  isSamaWorkflow = false;
  vicAmountToBeRefunded = 500;
  vicRefundDetials: CreditBalanceDetails;
  refundedAmount: number;
  vicSuccessMessage: BilingualText;
  isSinVaild = false;
  isActive = false;
  initiatorRoleId: string = undefined;
  socialInsuranceNumber: number;
  lang = 'en';
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  uuid: string;
  wizardItems: WizardItem[] = [];
  currentTab = 0;
  isSave = false;
  modalRef: BsModalRef;
  vicCreditRefundDetailsReq: CreditRefundRequest;
  vicPaymentResponse: PaymentResponse = new PaymentResponse();
  refNumber: number;
  reqNo: number;
  amount: number;
  personRequest: PersonRequest = new PersonRequest();
  oldIban: string;
  bankStatusList: string[];
  changeRequest: ChangeRequest[];
  isBankRequestinProgress = false;
  regNo: number;
  isContributorActive = false;
  ibanDetails: string;
  /** Child components */
  @ViewChild('vicRefundWizard', { static: false })
  vicRefundWizard: ProgressWizardDcComponent;
  @ViewChild('vicRefundConfirmView', { static: true })
  vicRefundConfirmView: TemplateRef<HTMLElement>;
  fromAppProfile: boolean;
  editFlag: boolean;
  isSamaFailed = false;
  isIbanAdded = false;
  isAppIndividual: boolean;
  isIbanDetails = false;

  constructor(
    private uuidGeneratorService: UuidGeneratorService,
    readonly routingService: BillingRoutingService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly coreService: CoreIndividualProfileService,
    readonly creditManagementService: CreditManagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly lookupService: LookupService,
    readonly route: ActivatedRoute,
    readonly workflowService: WorkflowService,
    readonly authTokenService: AuthTokenService,
    readonly location: Location
  ) {
    super(alertService, routingService, lookupService);
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('idNo')) {
        if (params) {
          this.fromAppProfile = true;
          this.socialInsuranceNumber = Number(params.get('idNo'));
          this.verifyContributorDetails(this.socialInsuranceNumber);
        }
      }
    });
    this.regNo = this.establishmentRegistrationNo.value;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.identifyTransaction();
    this.getLookUpValues();
    if (this.workflowFlag) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.refNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.socialInsuranceNumber = payload.socialInsuranceNo;
        this.reqNo = payload.requestId ? Number(payload.requestId) : null;
        this.initiatorRoleId = this.routerDataToken.initiatorRoleId;
        this.isSinVaild = true;
        this.verifyContributorDetails(this.socialInsuranceNumber);
        this.getVicCreditRefundAmt(this.socialInsuranceNumber, this.reqNo);
        this.getVicDocumentsOnEdit();
      }
      this.regNo = this.vicCreditRefundDetailsReq?.registrationNo;
    } else this.uuid = this.uuidGeneratorService.getUuid();
    this.setWizardDetails();
  }
  identifyTransaction() {
    this.route.url.subscribe(res => {
      //console.log('identifyTransaction', res);
      if (res[1] && res[1].path === 'edit') this.workflowFlag = true;
    });
  }
  checkSinValidity() {
    this.alertService.clearAlerts();
    if (this.contributorDetails) {
      if (this.contributorDetails.statusType !== ContributorStatus.ACTIVE) {
        this.isSinVaild = false;
        this.isContributorActive = false;
        this.alertService.showErrorByKey('BILLING.VIC-INACTIVE');
        return false;
      } else {
        this.isContributorActive = true;
        return true;
      }
    }
  }
  setWizardDetails() {
    this.wizardItems = this.getWizardItem();
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }
  /** Method to get wizard items */
  getWizardItem() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BillingConstants.CREDIT_REFUND_BALANCE_DETAILS, 'hand-holding-usd'));
    wizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /** Method to navigate back to previous section. */
  previousFormDetails() {
    this.isSave = false;
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.vicRefundWizard.setPreviousItem(this.currentTab);
  }
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.vicRefundWizard) this.vicRefundWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
  getLookUpValues(): void {
    this.transferModeList$ = this.lookupService.getTransferModeList();
    this.creditRetainedList$ = this.lookupService.getCreditRetainList();
  }
  /** Method to get user role for field office. */
  getUserRolesFO() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleValues = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    if (!this.workflowFlag) {
      if (this.userRoleValues.indexOf(RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR.toString()) !== -1)
        this.isRefundCreditBalance = true;
    }
  }
  /**Method to verify SIN */
  verifyContributorDetails(sin: number) {
    this.currentTab = 0;
    this.uuid = this.uuidGeneratorService.getUuid();
    this.getUserRolesFO();
    this.socialInsuranceNumber = sin;
    this.creditManagementService.getContirbutorDetails(sin).subscribe(
      data => {
        this.contributorDetails = data;
        if (this.checkSinValidity()) {
          this.getPersonChangeRequest(data?.person?.personId);
          this.getContributorDetails(data?.person?.personId);
          this.getContributorRefundDetails(this.socialInsuranceNumber, this.isContributorActive);
        }
      },
      errs => {
        this.isSinVaild = false;
        this.alertService.showError(errs.error.message);
      }
    );
  }
  getPersonChangeRequest(personId: number) {
    this.creditManagementService.getChangePersonRequest(personId, 'Bank Details').subscribe(
      res => {
        this.personRequest = res;
        this.changeRequest = this.personRequest?.changeRequestList?.filter(
          changeReq => changeReq?.status === 'WORKFLOW IN VALIDATION'
        );
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  /** Method to get Refund account details */
  getContributorRefundDetails(sin: number, status: boolean) {
    this.creditManagementService.getContirbutorRefundDetails(sin, status).subscribe(data => {
      this.vicRefundDetials = data;
      if (this.vicRefundDetials.eligibleForRefund === false) {
        this.alertService.showErrorByKey('BILLING.VIC-INACTIVE');
        this.isActive = false;
      } else this.isActive = true;
      if (this.vicRefundDetials.totalCreditBalance === 0) {
        this.alertService.showErrorByKey('BILLING.NO-CREDIT-BALANCE-ERROR-MESG');
        this.isSinVaild = false;
      } else this.isSinVaild = true;
    });
  }
  /**----Method to get contributo IBAN details */
  getContributorDetails(personId: number) {
    this.creditManagementService.getVicContirbutorIbanDetails(personId).subscribe(
      ibanDetais => {
        if (ibanDetais.bankAccountList && ibanDetais.bankAccountList[0]) {
          if (
            ibanDetais?.bankAccountList[0]?.verificationStatus === 'Sama Not Verified' ||
            ibanDetais?.bankAccountList[0]?.verificationStatus === 'Sama Verification Pending'
          )
            this.isSamaWorkflow = true;
          this.ibanNumber = this.oldIban = ibanDetais?.bankAccountList[0]?.ibanBankAccountNo;
          this.bankName = ibanDetais?.bankAccountList[0].bankName;
        }
        if (ibanDetais.bankAccountList[0]?.verificationStatus === 'Sama Verification Failed') {
          this.isSamaFailed = true;
        }
        if (ibanDetais.bankAccountList.length === 0) {
          this.isIbanDetails = true;
          this.isIbanAdded = true;
        }
      },
      errs => this.alertService.showError(errs.error.message)
    );
  }
  // * Method to navigate to doocument page
  confirmDetails() {
    if (this.ibanNumber === '' && this.isBankTransfer) this.alertService.showErrorByKey('BILLING.BANK-MANDATORY-VIEW');
    else {
      this.alertService.clearAlerts();
      this.showModal(this.vicRefundConfirmView, 'md');
      if (!this.isBankTransfer) {
        this.isSamaFailed = false;
      }
    }
  }
  showModal(template: TemplateRef<HTMLElement>, size: string) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /**Method to navigate to document page of vic credit refund */
  navigateToVicDocumentPage() {
    this.modalRef.hide();
    this.currentTab = 1;
    if (this.workflowFlag) this.vicRefundWizard.setNextItem(this.currentTab);
    scrollToTop();
    if (!this.workflowFlag) this.retrieveScannedVicDocuments();
  }
  cancelVicPopup() {
    this.modalRef.hide();
  }
  retrieveScannedVicDocuments() {
    this.getVicDocuments().subscribe((documents: DocumentItem[]) => {
      this.documentList = documents;
      this.documentList.forEach(doc => {
        this.refreshDocumentForVic(doc);
      });
      this.nextForm();
    });
  }
  /**  * Method to fetch the required document for scanning.  */
  getVicDocuments() {
    return this.documentService
      .getRequiredDocuments(BillingConstants.CREDIT_REFUND_VIC_ID, BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE)
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error)),
        tap(res => (this.documentList = res))
      );
  }
  /*** Method to perform feedback call after scanning.*/
  refreshDocumentForVic(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.socialInsuranceNumber,
          BillingConstants.CREDIT_REFUND_VIC_ID,
          BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
          null,
          null,
          this.uuid
        )
        .pipe(
          tap(res => (document = res)),
          tap(res => (document = res)),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  cancelVicCreditRefundPage() {
    if (this.workflowFlag) this.routingService.navigateToValidator();
    else this.cancelDetails();
  }
  cancelVicCreditRefundUpload() {
    if (this.workflowFlag) {
      this.creditManagementService.revertVicRefundDocumentDetails(this.socialInsuranceNumber, this.reqNo).subscribe(
        () => this.routingService.navigateToValidator(),
        err => this.alertService.showError(err.error.message)
      );
    } else this.cancelDetails();
  }
  cancelDetails() {
    this.location.back();
  }
  /** Method to save vic credit refund details */
  submitVicCreditRefundDetails() {
    this.alertService.clearAlerts();
    this.createVicFormData();
    if (this.checkVicMandatoryDocuments()) {
      this.vicCreditRefundDetailsReq = bindToObject(
        { ...this.vicCreditRefundDetailsReq, bankName: this.bankName },
        this.vicCreditRefundMainForm.get('commentForm').value
      );
      if (this.vicCreditRefundDetailsReq) {
        this.vicCreditRefundDetailsReq.uuid = this.uuid;
        this.vicCreditRefundDetailsReq.retained = this.iscreditRetained;
      }
      if (this.vicCreditRefundDetailsReq.paymentMode !== 'CHEQUE')
        this.vicCreditRefundDetailsReq.iban = this.ibanNumber;
      this.vicCreditRefundDetailsReq.amount = Number(this.vicAmountToBeRefunded);
      if (this.isRefundCreditBalance === false) this.vicCreditRefundDetailsReq.retained = true;
      if (this.isIbanEdit === true) {
        this.ibanDetails = IbanModification.IBAN_MODIFIED;
      } else {
        this.ibanDetails = IbanModification.NO_CHANGE;
      }
      if (this.isIbanAdded === true) {
        this.ibanDetails = IbanModification.IBAN_ADDED;
      }
      if (!this.workflowFlag) {
        this.creditManagementService
          .submitVicCreditRefundDetails(this.socialInsuranceNumber, this.vicCreditRefundDetailsReq, this.ibanDetails)
          .pipe(
            tap(val => {
              this.vicPaymentResponse.fromJsonToObject(val);
              this.vicSuccessMessage = this.vicPaymentResponse.message; //Setting success message
              if (this.vicSuccessMessage) {
                this.isSinVaild = false;
                this.router.navigate(['home/billing/credit-transfer/vic-refund-credit-balance/refresh']);
              }
              this.isSinVaild = false;
              this.coreService.setSuccessMessage(this.vicSuccessMessage, true);
              this.alertService.showSuccess(this.vicSuccessMessage, null);
              //this.location.back();
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      } else {
        this.creditManagementService
          .updateVicCreditRefundDetails(
            this.socialInsuranceNumber,
            this.reqNo,
            this.vicCreditRefundDetailsReq,
            this.ibanDetails
          )
          .pipe(
            tap(res => {
              this.vicPaymentResponse.fromJsonToObject(res);
              this.vicSuccessMessage = this.vicPaymentResponse.message; //Setting success message
              if (this.vicSuccessMessage) this.isSinVaild = true;
              this.handleWorkflowActions();
              this.coreService.setSuccessMessage(this.vicSuccessMessage, true);
              setTimeout(() => this.alertService.showSuccess(this.vicSuccessMessage, null), 1000);
              this.location.back();
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    } else this.alertService.showMandatoryErrorMessage();
  }
  /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkVicMandatoryDocuments() {
    let isVicDocumentsValid: boolean;
    if (this.isAppPrivate) isVicDocumentsValid = this.documentService.checkMandatoryDocuments(this.documentList);
    return isVicDocumentsValid;
  }
  // * Method to get vic refunded amount
  setVicAmountToBeRefunded(refundAmt) {
    this.vicAmountToBeRefunded = refundAmt;
  }
  // * Method to get new bank name and iban
  newBankDetails(bankDet) {
    if (bankDet.iban) {
      if (this.oldIban !== bankDet.iban) {
        this.isIbanEdit = true;
        this.isSamaFailed = false;
        this.isIbanDetails = false;
      } else {
        this.isIbanEdit = false;
      }
      this.ibanNumber = bankDet.iban;
      this.bankName = bankDet.bankName;
      this.editFlag = bankDet.isEdit;
    }
  }
  /** Method to create vic form data*/
  createVicFormData() {
    this.vicCreditRefundDetailsReq = bindToObject(
      new CreditRefundRequest(),
      this.vicCreditRefundMainForm.get('commentForm').value
    );
    if (this.vicCreditRefundMainForm.get('bankModeForm.paymentMode.english').value === BillingConstants.CHEQUE)
      this.vicCreditRefundDetailsReq.paymentMode = 'CHEQUE';
    else this.vicCreditRefundDetailsReq.paymentMode = 'BANK_TRANSFER';
    this.vicCreditRefundDetailsReq.amount = this.vicAmountToBeRefunded;
  }
  /** Method to get credit refunded amount. */
  getVicCreditRefundAmt(sin: number, requestNo: number) {
    this.creditManagementService.getVicCreditRefundAmountDetails(sin, requestNo).subscribe(
      value => {
        this.creditRefundDetails = value;
        if (this.initiatorRoleId === Role.CUSTOMER_SERVICE_SUPERVISOR) this.isRefundCreditBalance = true;
        if (this.creditRefundDetails.paymentMode.english !== BillingConstants.CHEQUE) this.getBankTranser(true);
        else this.getBankTranser(false);
        this.amount = value.requestedAmount;
        if (this.creditRefundDetails?.iban) {
          this.ibanNumber = this.creditRefundDetails?.iban;
          this.lookupService.getBankForIban(this.creditRefundDetails?.iban.slice(4, 6)).subscribe(
            res => (this.bankName = res.items[0]?.value),
            err => this.showErrorMessage(err)
          );
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  getVicDocumentsOnEdit() {
    this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
        this.socialInsuranceNumber,
        this.refNumber
      )
      .subscribe(document => (this.documentList = document));
    this.documentList.forEach(document => {
      this.refreshDocumentForVic(document);
    });
  }
  handleWorkflowActions() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (
      this.vicCreditRefundMainForm &&
      this.vicCreditRefundMainForm.value &&
      this.vicCreditRefundMainForm.value.commentForm
    )
      bpmUpdateRequest.comments = this.vicCreditRefundMainForm.value.commentForm.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
      () => this.navBackToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
}
