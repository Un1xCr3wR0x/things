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
  BilingualText,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  scrollToTop,
  UuidGeneratorService,
  WizardItem,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import {
  ContributorRefundRequest,
  CreditBalanceDetails,
  VicCreditRefundIbanDetails,
  PaymentResponse,
  ContributorAmountDetails,
  SelectedTerminationPeriodDetails,
  TerminationTransactionsDetails,
  VicContributorDetails
} from '../../../../shared/models';
import { BillingRoutingService, EstablishmentService } from '../../../../shared/services';
import { CreditManagementService } from '../../../../shared/services/credit-management.service';

@Component({
  selector: 'blg-refund-contributor-amount-sc',
  templateUrl: './refund-contributor-amount-sc.component.html',
  styleUrls: ['./refund-contributor-amount-sc.component.scss']
})
export class RefundContributorAmountScComponent implements OnInit {
  //Local Variables
  lan = 'en';
  accountDetails: CreditBalanceDetails;
  contributorDetails: VicContributorDetails;
  currentTab = 0;
  contributorRefundWizardItems: WizardItem[] = [];
  modalRef: BsModalRef;
  documents: DocumentItem[] = [];
  uuid: string;
  contributorRefundMainForm: FormGroup = new FormGroup({});
  contributorAccountDetails: VicCreditRefundIbanDetails;
  sin: number;
  isUserLoggedIn: boolean;
  regNo: number;
  totalCreditBalance = 0;
  status: BilingualText;
  bankName: BilingualText;
  bankNameFromApi: BilingualText;
  isIbanEdit = false;
  ibanNumber: string;
  personId: number;
  contributorRefundRequest: ContributorRefundRequest;
  refundResponse: PaymentResponse = new PaymentResponse();
  successMsg: BilingualText;
  recipientDetail: ContributorAmountDetails[];
  selectedTerminationPeriod: SelectedTerminationPeriodDetails[] = [];
  contributorShare = 0;
  oldIban: string;
  listItem: ContributorAmountDetails;
  transactionsDetails: TerminationTransactionsDetails;
  isWorkflow: boolean;
  requestNo: number;
  referenceNumber: number;
  outcome = WorkFlowActions.UPDATE;
  /** Observables */
  transferModeList$: Observable<LovList>;
  /** Constants */
  documentTransactionId = BillingConstants.CONTRIBUTOR_REFUND_DOCUMENT_TRANSACTION_ID;
  /** Child components */
  @ViewChild('contributorRefundWizard', { static: false })
  contributorRefundWizard: ProgressWizardDcComponent;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly alertService: AlertService,
    private uuidGeneratorService: UuidGeneratorService,
    readonly creditManagementService: CreditManagementService,
    readonly lookupService: LookupService,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly routingService: BillingRoutingService,
    readonly workflowService: WorkflowService
  ) {}

  /** Method to initialise the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lan = language;
    });
    this.initializeWizards();
    this.getLookupValues();
    this.route.queryParams.subscribe(params => {
      this.sin = params.socialInsuranceNo;
      this.regNo = params.registrationNumber;
      if (params.workflow === 'true') this.isWorkflow = true;
      else this.isWorkflow = false;
      this.requestNo = params.requestNo;
      this.referenceNumber = params.referenceNumber;
      this.getEstDetails(this.regNo);
      if (!this.isWorkflow) this.getContributorDetails();
      this.getCreditBalance();
    });
    this.selectedTerminationPeriod = this.creditManagementService.getSelectedTerminationPeriod();
    this.recipientDetail = [];
    this.selectedTerminationPeriod.forEach(data => {
      this.contributorShare += data.contributorShare;
      const listItem = {
        amount: data.contributorShare,
        engagementId: data.engagementId
      };
      this.recipientDetail.push(listItem);
    });
    if (!this.isWorkflow) this.uuid = this.uuidGeneratorService.getUuid();
    else {
      this.getBackdatedTerminationValues();
      this.getDocumentsOnValidatorEdit();
    }
  }

  /** Method to initialize the navigation wizard. */
  initializeWizards() {
    this.contributorRefundWizardItems = this.getWizards();
    this.contributorRefundWizardItems[0].isDisabled = false;
    this.contributorRefundWizardItems[0].isActive = true;
  }

  /**
   * This method is used to search establishment details.
   * @param registrationNumber
   */
  getEstDetails(registrationNumber: number) {
    this.establishmentService.getEstablishment(registrationNumber).subscribe(
      establishment => {
        this.alertService.clearAlerts();
        this.status = establishment.status;
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  /** Method to get contributor account details. */
  getCreditBalance() {
    this.creditManagementService.getAvailableCreditBalance(this.regNo).subscribe(
      value => {
        this.totalCreditBalance = value.totalCreditBalance;
      },
      errs => this.alertService.showError(errs.error.message)
    );
  }
  /** Method to get lookup values. */
  getLookupValues(): void {
    this.transferModeList$ = this.lookupService.getTransferModeList();
  }
  /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BillingConstants.REFUND_CONTRIBUTOR_DETAILS, 'hand-holding-usd'));
    wizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }

  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /**----Method to get contributor IBAN details */
  getContributorDetails() {
    this.creditManagementService.getContirbutorIbanDetails(this.regNo, this.sin).subscribe(
      ibanDetais => {
        this.oldIban = this.ibanNumber = ibanDetais.bankAccountList[0].ibanBankAccountNo;
        this.bankName = ibanDetais.bankAccountList[0].bankName;
      },
      errs => this.alertService.showError(errs.error.message)
    );
  }

  /**----Method to navigate to doc page */
  navigateToDocPage() {
    this.currentTab = 1;
    if (!this.isWorkflow) this.retrieveScannedContributorRefundDocs();
    else this.navToNextForm();
  }

  /** Method to get documents. */
  getDocumentsOnValidatorEdit() {
    this.documentService
      .getDocuments(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE,
        this.sin,
        this.referenceNumber
      )
      .subscribe(doc => (this.documents = doc));
    this.documents.forEach(doc => {
      this.refreshDocuments(doc);
    });
  }
  /**
   * Method to retrieve scanned documents for contributor refund.
   */

  retrieveScannedContributorRefundDocs() {
    this.getContributorRefundDocuments().subscribe((documents: DocumentItem[]) => {
      this.documents = documents;
      this.documents.forEach(doc => {
        this.refreshDocuments(doc);
      });
      this.navToNextForm();
    });
  }
  /**
   * Method to fetch the required document for scanning.
   * @param receiptMode receipt mode
   */
  getContributorRefundDocuments() {
    return this.documentService
      .getRequiredDocuments(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error)),
        tap(res => (this.documents = res))
      );
  }
  /**
   * Method to perform refresh the documents after scanning.
   * @param document
   */
  refreshDocuments(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.sin,
          BillingConstants.CONTRIBUTOR_REFUND_ID,
          BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE,
          this.isWorkflow ? this.referenceNumber : null,
          null,
          !this.isWorkflow ? this.uuid : null
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
  /** Method to show error alerts. */
  showErrors(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }

  /** Method to navigate to next forms */
  navToNextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.contributorRefundWizard) this.contributorRefundWizard.setNextItem(this.currentTab);
    scrollToTop();
  }
  /** Method to navigate back to first page */
  navigateBackToContributorRefundPage() {
    this.router.navigate(['home/billing/credit-transfer/contributor-refund-credit-balance/request'], {
      queryParams: {
        socialInsuranceNo: this.sin,
        registrationNumber: this.regNo,
        isUserLoggedIn: true
      }
    });
  }
  /** Method to cancel the popup */
  cancelRefundAmountPage() {
    if (this.isWorkflow) {
      this.creditManagementService
        .revertContributorRefundDocumentDetails(this.regNo, this.sin, this.requestNo)
        .subscribe(
          () => this.routingService.navigateToValidator(),
          err => this.alertService.showError(err.error.message)
        );
    } else if (!this.isWorkflow) this.router.navigate(['home']);
  }
  /** Method to navigate back to previous section. */
  previousFormDet() {
    this.alertService.clearAlerts();
    this.currentTab--;
    this.contributorRefundWizard?.setPreviousItem(this.currentTab);
    scrollToTop();
  }
  /** Method to submit contributor refund details. */
  submitContributorRefundDetails() {
    this.alertService.clearAlerts();
    this.createContributorRefundData();
    if (this.checkMandatoryDocs()) {
      this.contributorRefundRequest = bindToObject(
        { ...this.contributorRefundRequest, bankName: this.bankName },
        this.contributorRefundMainForm.get('commentForm').value
      );
      this.contributorRefundRequest = bindToObject(
        this.contributorRefundRequest,
        this.contributorRefundMainForm.get('contributorBankDetailsForm').value
      );
      this.contributorRefundRequest.uuid = this.uuid;
      this.contributorRefundRequest.iban = this.ibanNumber;
      this.contributorRefundRequest.recipientDetail = [];
      this.contributorRefundRequest.recipientDetail = this.recipientDetail;
      if (!this.isWorkflow) {
        this.creditManagementService
          .submitContributorRefundDetails(this.regNo, this.sin, this.contributorRefundRequest, this.isIbanEdit)
          .pipe(
            tap(data => {
              this.refundResponse.fromJsonToObject(data);
              this.successMsg = this.refundResponse.message; //Setting success message
              if (this.successMsg) {
                this.isUserLoggedIn = false;
                this.router.navigate(['home/billing/credit-transfer/contributor-refund-credit-balance/request']);
              }
              this.alertService.showSuccess(this.successMsg, null, 10);
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      } else {
        this.creditManagementService
          .updateContributorRefundDetails(
            this.regNo,
            this.sin,
            this.requestNo,
            this.contributorRefundRequest,
            this.isIbanEdit
          )
          .pipe(
            tap(res => {
              this.refundResponse.fromJsonToObject(res);
              this.alertService.showSuccess(this.refundResponse.message, null, 10);
              // this.router.navigate(['home/billing/credit-transfer//establishment-refund-credit-balance']);
              this.handleWorkflow();
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

  // Method to handle work flow actions on edit
  handleWorkflow() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.UPDATE;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (
      this.contributorRefundMainForm &&
      this.contributorRefundMainForm.value &&
      this.contributorRefundMainForm.value.commentForm
    )
      bpmUpdateRequest.comments = this.contributorRefundMainForm.value.commentForm.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, this.outcome).subscribe(
      () => this.navigateToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
  /** Method to navigate back to inbox page */
  navigateToInbox() {
    this.routingService.navigateToInbox();
  }
  /** Method to check whether mandatory documents are scanned or not. */
  checkMandatoryDocs() {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }
  /** Method to create contributor refund data. */
  createContributorRefundData() {
    this.contributorRefundRequest = bindToObject(
      new ContributorRefundRequest(),
      this.contributorRefundMainForm.get('commentForm').value
    );
    this.contributorRefundRequest = bindToObject(
      new ContributorRefundRequest(),
      this.contributorRefundMainForm.get('contributorBankDetailsForm').value
    );
    if (
      this.contributorRefundMainForm.get('contributorBankDetailsForm').get('option').get('english').value ===
      'Bank Transfer'
    ) {
      this.contributorRefundRequest.paymentMode = 'BANK_TRANSFER';
    } else this.contributorRefundRequest.paymentMode = 'CHEQUE';
  }
  /** Method to get termination details of contributor . */
  getBackdatedTerminationValues() {
    this.creditManagementService.getBackdatedTerminationDetails(this.regNo, this.sin, this.requestNo).subscribe(
      val => {
        this.transactionsDetails = val;
        this.ibanNumber = this.transactionsDetails.iban;
        this.lookupService.getBankForIban(this.transactionsDetails.iban.slice(4, 6)).subscribe(
          res => {
            this.bankName = res.items[0]?.value;
          },
          err => this.showErrorMessage(err)
        );
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  onGetBankName(iban) {
    this.getBank(iban);
  }
  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param iban
   */
  getBank(iBanCode) {
    this.lookupService.getBankForIban(iBanCode.slice(4, 6)).subscribe(
      res => {
        this.bankNameFromApi = res.items[0]?.value;
      },
      err => this.showErrorMessage(err)
    );
  }
  // * Method to get new bank name and iban
  saveNewBankDetails(bankDet) {
    if (bankDet.iban) {
      if (this.oldIban !== bankDet.iban) this.isIbanEdit = true;
      else this.isIbanEdit = false;
      this.isIbanEdit = true;
      this.ibanNumber = bankDet.iban;
      this.bankName = bankDet.bankName;
    }
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }
}
