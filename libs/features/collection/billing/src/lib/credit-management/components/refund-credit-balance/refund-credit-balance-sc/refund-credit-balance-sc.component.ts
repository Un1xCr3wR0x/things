/*** Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.*/
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BPMUpdateRequest,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  Role,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  StorageService,
  UuidGeneratorService,
  WizardItem,
  WorkflowService,
  bindToObject,
  scrollToTop
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BillingConstants, RouteConstants } from '../../../../shared/constants';
import { TransactionOutcome } from '../../../../shared/enums/transaction-outcome';
import {
  CreditBalanceDetails,
  CreditRefundDetails,
  CreditRefundRequest,
  CreditRefundUpdateRequest,
  EstablishmentDetails,
  PaymentResponse
} from '../../../../shared/models';
import {
  BillingRoutingService,
  ContributionPaymentService,
  CreditManagementService,
  EstablishmentService
} from '../../../../shared/services';
import { CreditTransferBaseScComponent } from './refund-credit-balance-sc.base.component';
@Component({
  selector: 'blg-refund-credit-balance-sc',
  templateUrl: './refund-credit-balance-sc.component.html',
  styleUrls: ['./refund-credit-balance-sc.component.scss']
})
export class RefundCreditBalanceScComponent extends CreditTransferBaseScComponent implements OnInit {
  /*-------------------Local Variables-------------------------- */
  establishmentDetails: EstablishmentDetails;
  lang = '';
  isAppPrivate: boolean;
  regNumber: number;
  searchResult = true;
  creditManagementWizardItems: WizardItem[] = [];
  creditBalanceDetails: CreditBalanceDetails;
  documentList: DocumentItem[] = [];
  currentBalance: CreditBalanceDetails;
  establishmentValues: EstablishmentDetails;
  creditRefundDetailsReq: CreditRefundRequest;
  paymentResponse: PaymentResponse = new PaymentResponse();
  successFlag = false;
  successMessage: BilingualText;
  isValid = false;
  errorFlag = false;
  isSave = false;
  ibanNumber: string;
  inWorkflow = false;
  requestNo: number;
  referenceNumber: number;
  receiptNumber: number;
  amount: number;
  isIbanValid = false;
  creditUpdateRefund: CreditRefundUpdateRequest;
  paymentMode: BilingualText;
  creditRefundDetails: CreditRefundDetails;
  isRefundCreditBalance = false;
  initiatorRoleId: string;
  userRoleValues: string[] = [];

  /** Observables */
  creditRetainedList$: Observable<LovList>;
  transferModeList$: Observable<LovList>;
  /** Constants */
  documentTransactionId = BillingConstants.CREDIT_REFUND_DOCUMENT_TRANSACTION_ID;
  creditRefundMainForm: FormGroup = new FormGroup({});
  @ViewChild('creditManagementWizard', { static: false }) /** Child components */
  creditManagementWizard: ProgressWizardDcComponent;
  @ViewChild('refundConfirmView', { static: true }) /** Template & directive references */
  refundConfirmView: TemplateRef<HTMLElement>;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly storageService: StorageService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    readonly creditManagementService: CreditManagementService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly workFlowService: WorkflowService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService,
    readonly routingService: BillingRoutingService,
    readonly workflowService: WorkflowService,
    readonly authTokenService: AuthTokenService,
    readonly location: Location
  ) {
    super(alertService, lookupService, modalService, documentService);
  }
  // This method is used to initailise the task
  ngOnInit() {
    this.alertService.clearAlerts();
    this.regNumber = this.establishmentRegistrationNo.value;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getLookUpValues();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.identifyModeOfTransaction();
    if (this.inWorkflow) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
        this.regNumber = payload.registrationNo;
        this.requestNo = payload.requestId ? Number(payload.requestId) : null;
        this.initiatorRoleId = this.routerDataToken.initiatorRoleId;
        this.searchResult = false;
        this.successFlag = false;
        this.getEstablishmentDetails(this.regNumber);
        this.getDocumentsOnEdit();
        this.initializeWizardDetails();
      }
    } else {
      this.getEstablishmentDetails(this.regNumber);
      this.uuid = this.uuidGeneratorService.getUuid();
      this.initializeWizardDetails();
    }
  }
  /** Method to set workflow data. */
  setWorkflowData(): BPMUpdateRequest {
    const data = new BPMUpdateRequest();
    if (this.routerDataToken) {
      data.taskId = this.routerDataToken.taskId;
      data.user = this.routerDataToken.assigneeId;
    }
    data.outcome = TransactionOutcome.UPDATE;
    data.commentScope = 'BPM';
    if (this.creditRefundMainForm && this.creditRefundMainForm.get('commentForm.comments'))
      data.comments = this.creditRefundMainForm.get('commentForm.comments').value;
    return data;
  }
  identifyModeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[1] && res[1].path === 'edit') this.inWorkflow = true;
    });
  }
  /** Method to get user role for field office. */
  getUserRolesFO() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleValues = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    if (!this.inWorkflow) {
      if (this.userRoleValues.indexOf(RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR.toString()) !== -1)
        this.isRefundCreditBalance = true;
    }
  }
  /*** This method is used to search establishment details.
   * @param idNumber
   * @param branchRequired*/
  getEstablishmentDetails(regNumber: number) {
    this.successFlag = false;
    this.currentTab = 0;
    this.initializeWizardDetails();
    this.getUserRolesFO();
    this.regNumber = regNumber;
    this.establishmentService.getEstablishment(regNumber).subscribe(
      establishment => {
        if (establishment?.status !== null && establishment.status !== undefined) {
          if (establishment?.status?.english === BillingConstants.REG_STATUS || establishment?.status?.english ===BillingConstants.REOPENED_STATUS) {
            this.contributionPaymentService.getWorkFlowStatus(regNumber).subscribe(res => {
              if (res.length !== 0) {
                res.forEach(value => {
                  if (value && !establishment?.gccCountry) {
                    if (value.type === BillingConstants.CHANGE_BANK_DETAILS) {
                      this.isIbanValid = true;
                    }
                    if (value.type === BillingConstants.CHANGE_OWNER) {
                      this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
                    } else this.getDetails(establishment);
                  } else this.getDetails(establishment);
                });
              } else this.getDetails(establishment);
            });
          } else {
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
          }
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  getDetails(establishment: EstablishmentDetails) {
    this.alertService.clearAlerts();
    this.getAvailableBalanceDetails(this.regNumber);
    this.establishmentDetails = establishment;
    this.oldIban = this.establishmentDetails?.establishmentAccount?.bankAccount?.ibanAccountNo;
    this.ibanNumber = this.establishmentDetails?.establishmentAccount?.bankAccount?.ibanAccountNo;
    this.bankName = this.establishmentDetails?.establishmentAccount?.bankAccount?.bankName;
    if (this.inWorkflow) this.getAllcreditDetails(this.regNumber, this.requestNo);
    if (this.establishmentDetails?.establishmentAccount?.bankAccount?.ibanAccountNo === null) {
      this.isIbanDetails = true;
    }
  }
  /** Method to get lookup values. */
  getLookUpValues(): void {
    this.transferModeList$ = this.lookupService.getTransferModeList();
    this.creditRetainedList$ = this.lookupService.getCreditRetainList();
  }
  // this method is used to get avaible balance for credit management
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(
      datas => {
        this.creditBalanceDetails = datas;
        if (this.creditBalanceDetails.totalCreditBalance === 0) {
          this.alertService.showErrorByKey('BILLING.NO-CREDIT-BALANCE-ERROR-MESG');
        } else this.searchResult = false;
      },
      errs => this.alertService.showError(errs.error.message)
    );
  }
  /** Method to initialize the navigation wizard. */
  initializeWizardDetails() {
    this.creditManagementWizardItems = this.getWizards();
    this.creditManagementWizardItems[0].isDisabled = false;
    this.creditManagementWizardItems[0].isActive = true;
  }
  /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BillingConstants.REFUND_CREDIT_DETAILS, 'hand-holding-usd'));
    wizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /** Method to cancel document upload page. */
  cancelCreditUpload() {
    if (this.inWorkflow) {
      this.alertService.clearAlerts();
      this.creditManagementService.revertRefundDocumentDetails(this.regNumber, this.requestNo).subscribe(
        () => this.navigateToBack(this.isAppPrivate),
        err => this.alertService.showError(err.error.message)
      );
    } else if (!this.inWorkflow) this.cancelDetails();
  } /** Method to navigate back. */
  navigateToBack(isAppPrivate) {
    if (isAppPrivate) {
      this.routingService.navigateToValidator();
    } else this.routingService.navigateToInbox();
  } /** Method to cancel available credit page. */
  cancelAvailableCreditPage() {
    if (this.inWorkflow) {
      this.alertService.clearAlerts();
      this.creditManagementService.revertRefundDocumentDetails(this.regNumber, this.requestNo).subscribe(
        () => this.navigateToBack(this.isAppPrivate),
        err => this.alertService.showError(err.error.message)
      );
    } else if (!this.inWorkflow) this.cancelDetails();
  } /** Method tonavigate back to home screen*/
  cancelDetails() {
    if (!this.isAppPrivate) {
      this.location.back();
    }
    this.router.navigate(['home']);
  } /** * Method to retrieve scanned documents. */
  retrieveScannedDocuments() {
    this.getDocuments().subscribe((documents: DocumentItem[]) => {
      this.documentList = documents;
      if (this.isAppPrivate) {
        this.documentList.splice(
          this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate'),
          1
        );
      } else {
        this.documentList.splice(
          this.documentList.findIndex(doc => doc.name.english === 'Request form'),
          1
        );
      }
      if (!this.isIbanEdit && !this.isAppPrivate) {
        this.documentList.splice(
          this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate'),
          1
        );
      }
      if (this.documentList.find(doc => doc.name.english)) {
        this.documentList[this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate')].required = true;
      }
      this.documentList.forEach(doc => {
        if (this.successFlag) this.refreshDocuments(doc);
      });
      this.nextForm();
    });
  }
  /** Method to get documents. */
  getDocumentsOnEdit() {
    this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_ID,
        BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE,
        this.regNumber,
        this.referenceNumber
      )
      .subscribe(doc => {
        this.documentList = doc;
        if (this.isAppPrivate) {
          this.documentList.splice(
            this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate'),
            1
          );
        } else {
          this.documentList.splice(
            this.documentList.findIndex(doc => doc.name.english === 'Request form'),
            1
          );
        }
        if (!this.isIbanEdit && !this.isAppPrivate) {
          this.documentList.splice(
            this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate'),
            1
          );
        }
        if (this.documentList.find(doc => doc.name.english)) {
          this.documentList[this.documentList.findIndex(doc => doc.name.english === 'IBAN Certificate')].required =
            true;
        }
      });
    this.documentList.forEach(doc => {
      this.refreshDocuments(doc);
    });
  }
  /** * Method to perform feedback call after scanning.
   * @param document */
  refreshDocuments(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.regNumber,
          BillingConstants.CREDIT_REFUND_ID,
          BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE,
          this.referenceNumber,
          null,
          this.uuid
        )
        .pipe(
          tap(res => {
            document = res;
          }),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /** Method to navigate back to previous section. */
  previousFormDetails() {
    this.isSave = false;
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.creditManagementWizard.setPreviousItem(this.currentTab);
  }
  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  } /** Method to navigate to next form */
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.creditManagementWizard) this.creditManagementWizard.setNextItem(this.currentTab);
    scrollToTop();
  } /** Method to submit refund credit details */
  submitCreditRefundDetails() {
    this.alertService.clearAlerts();
    this.createFormData();
    this.submitRefundTransfer();
  } /** Method to save refund credit details */
  submitRefundTransfer() {
    if (this.checkMandatoryDocuments()) {
      if (this.creditRefundMainForm && this.creditRefundMainForm.get('commentForm')) {
        this.creditRefundDetailsReq = bindToObject(
          { ...this.creditRefundDetailsReq, bankName: this.bankName },
          this.creditRefundMainForm.get('commentForm').value
        );
        this.creditRefundDetailsReq.retained = this.iscreditRetained;
        this.creditRefundDetailsReq.uuid = this.uuid;
        if (this.creditRefundDetailsReq.paymentMode !== 'CHEQUE') {
          this.creditRefundDetailsReq.iban = this.ibanNumber;
          this.creditRefundDetailsReq.bankName = this.bankName;
        }
        this.creditRefundDetailsReq.amount = Number(this.AmountToBeRefunded);
        this.creditUpdateRefund = bindToObject(
          this.creditUpdateRefund,
          this.creditRefundMainForm.get('commentForm').value
        );
        this.creditUpdateRefund.retained = this.iscreditRetained;
        if (this.creditRefundDetailsReq.paymentMode !== 'CHEQUE') this.creditUpdateRefund.iban = this.ibanNumber;
        this.creditUpdateRefund.bankName = this.bankName;
        if (!this.isRefundCreditBalance) {
          this.creditRefundDetailsReq.retained = true;
          this.creditUpdateRefund.retained = true;
        }
        this.creditUpdateRefund.paymentMode = this.creditRefundDetailsReq.paymentMode;
        this.creditUpdateRefund.amount = this.creditRefundDetailsReq.amount;
        if (!this.isIbanEdit && this.isIbanValid && this.creditRefundDetailsReq.paymentMode !== 'CHEQUE') {
          this.alertService.showErrorByKey('BILLING.IBAN-IN-WORKFLOW');
        } else if (!this.inWorkflow) {
          this.creditManagementService
            .submitCreditRefundDetails(this.regNumber, this.creditRefundDetailsReq, this.isIbanEdit)
            .pipe(
              tap(data => {
                this.paymentResponse.fromJsonToObject(data);
                this.successMessage = this.paymentResponse.message; //Setting success message
                if (this.successMessage) {
                  this.successFlag = true;
                  this.alertService.showSuccess(this.successMessage, null);
                  this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(this.regNumber)]);
                }
              }),
              catchError(err => {
                this.alertService.showError(err.error.message);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
        } else {
          this.creditManagementService
            .updateCreditRefundDetails(this.regNumber, this.requestNo, this.creditUpdateRefund, this.isIbanEdit)
            .pipe(
              tap(res => {
                this.paymentResponse.fromJsonToObject(res);
                this.successMessage = this.paymentResponse.message; //Setting success message
                if (this.successMessage) {
                  this.successFlag = true;
                  this.handleWorkflowActions();
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
      }
    } else this.alertService.showMandatoryErrorMessage();
  }
  handleWorkflowActions() {
    this.workFlowService.updateTaskWorkflow(this.setWorkflowData()).subscribe(
      () => this.navigateBackToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  } /** Method to navigate back to inbox page */
  navigateBackToInbox() {
    if (this.isAppPrivate) {
      this.routingService.navigateToInbox();
    } else {
      this.routingService.navigateToPublicInbox();
    }
  }
  /** * Method to check form validity
   * @param form form control */
  checkFormValidity(form: AbstractControl) {
    if (form) return form.valid;
  }
  createFormData() {
    this.creditRefundDetailsReq = bindToObject(
      new CreditRefundRequest(),
      this.creditRefundMainForm.get('commentForm').value
    );
    if (this.creditRefundMainForm.get('bankModeForm.paymentMode.english').value === BillingConstants.CHEQUE)
      this.creditRefundDetailsReq.paymentMode = 'CHEQUE';
    else this.creditRefundDetailsReq.paymentMode = 'BANK_TRANSFER';
    this.creditRefundDetailsReq.amount = this.AmountToBeRefunded;
  } // * Method to set error message
  setErrorMessage(res) {
    if (res === true) this.alertService.showErrorByKey('BILLING.TOTAL-AMOUNT-GRT-THN-TRANSFERABLE-AMOUNT');
  }

  cancelPopup() {
    this.isSave = false;
  }

  confirmRefundModal() {
    this.modalRef.hide();
    this.currentTab = 1;
    if (!this.inWorkflow) this.retrieveScannedDocuments();
    else {
      if (this.oldIban !== this.ibanNumber && this.inWorkflow) {
        this.isIbanEdit = true;
      }
      this.getDocumentsOnEdit();
      this.nextForm();
    }
  }
  cancelRefundModal() {
    this.modalRef.hide();
  } /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkMandatoryDocuments() {
    let isDocumentsValid: boolean;
    isDocumentsValid = this.documentService.checkMandatoryDocuments(this.documentList);
    return isDocumentsValid;
  } /** Method to get all credit establishment details. */
  getAllcreditDetails(registrationNumber, requestNo) {
    this.creditManagementService.getRefundDetails(registrationNumber, requestNo).subscribe(data => {
      this.creditRefundDetails = data;
      if (this.creditRefundDetails) {
        if (this.initiatorRoleId === Role.CUSTOMER_SERVICE_SUPERVISOR) this.isRefundCreditBalance = true;
        this.amount = this.creditRefundDetails.requestedAmount;
        if (this.creditRefundDetails?.iban && this.inWorkflow) {
          this.ibanNumber = this.creditRefundDetails.iban;
          this.lookupService.getBankForIban(this.ibanNumber.slice(4, 6)).subscribe(res => {
            this.bankName = res.items[0]?.value;
          });
          if (this.creditRefundDetails?.paymentMode?.english === 'Cheque') this.isBankTransfer = false;
          if (this.creditRefundDetails?.paymentMode?.english !== BillingConstants.CHEQUE) this.getBankTranser(true);
        }
      }
    });
  }
  // * Method to navigate to doocument page
  navigateToDocumentPage() {
    if (this.ibanNumber === null && this.isBankTransfer)
      if (this.isAppPrivate) {
        this.alertService.showErrorByKey('BILLING.BANK-MANDATORY-VIEW');
      } else {
        this.alertService.showErrorByKey('BILLING.BANK-MANDATORY-IBAN');
      }
    else {
      this.alertService.clearAlerts();
      this.showModal(this.refundConfirmView, 'md');
    }
  }
}
