/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  BilingualText,
  DocumentItem,
  DocumentService,
  ExchangeRateService,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  LookupService,
  LovList,
  BPMUpdateRequest,
  AlertService,
  WorkflowService,
  WorkFlowActions,
  BPMMergeUpdateParamEnum,
  Transaction
} from '@gosi-ui/core';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { iif, noop, Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants';
import {
  CurrencyArabic,
  ReceiptType,
  CurrencyArabicShortForm,
  TransactionOutcome,
  MCITransaction
} from '../../../../shared/enums';
import { CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../../shared/models';
import { ContributionPaymentService, EstablishmentService, BillingRoutingService } from '../../../../shared/services';
import { assembleCurrencyDetails, createBilingualObject } from '../../../../shared/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import moment from 'moment-timezone';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';

@Component({
  selector: 'blg-validate-cancel-receipt-sc',
  templateUrl: './validate-cancel-receipt-sc.component.html',
  styleUrls: ['./validate-cancel-receipt-sc.component.scss']
})
export class ValidateCancelReceiptScComponent implements OnInit {
  /** Local variables */
  currencySAR = BillingConstants.CURRENCY_SAR;
  canReject: boolean;
  canReturn: boolean;
  canEdit: boolean;
  transactionNumber: number;
  registrationNumber: number;
  receiptNumber: number;
  establishment: EstablishmentDetails;
  receipt: PaymentDetails;
  currencyDetails: CurrencyDetails;
  documents: DocumentItem[];
  isGccCountry = false;
  currency: BilingualText;
  comments: TransactionReferenceData[] = [];
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  modalRef: BsModalRef;
  validatorForm: FormGroup = new FormGroup({});
  cancelReceiptbillBatchIndicator = false;
  isEditApprove = false;
  isReopenClosingInProgress : boolean;

  /** Observables */
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  transaction: Transaction[] = [];
  initialDate1: Date;
  initialDate2: Date;
  isDate: boolean;
  isShow: boolean;
  trans: Transaction;

  /** Creates an insatance of ValidateCancelReceiptScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly exchangeRateService: ExchangeRateService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly routingService: BillingRoutingService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly workflowService: WorkflowService,
    readonly transactionService: TransactionService
  ) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.getKeysFromToken();
    this.identifyValidatorActions(this.routerData.assignedRole);
    this.getLookupValues();
    if (this.receiptNumber && this.registrationNumber) this.getDataForView();
  }

  /** Method to read keys from token. */
  getKeysFromToken(): void {
    const payload = this.routerData.payload ? JSON.parse(this.routerData.payload) : null;
    if (payload) {
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.receiptNumber = payload.parentReceiptNo ? Number(payload.parentReceiptNo) : null;
    }
    if (this.routerData.comments.length > 0) {
      this.comments = this.routerData.comments;
    }
    this.transactionNumber = this.routerData.transactionId;
  }
  /** Method to get lookup values for component. */
  getLookupValues(): void {
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
  }
  /** Method to identify validator actions. */
  identifyValidatorActions(role: string): void {
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = false;
      this.canEdit = true;
    } else if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.canReject = true;
      this.canReturn = true;
      this.canEdit = false;
    }
  }

  /** Method to get data for view. */
  getDataForView(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishment = res;
          this.isReopenClosingInProgress = res?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
          if (this.establishment.gccEstablishment) this.isGccCountry = true;
          else {
            this.currencyDetails = new CurrencyDetails(createBilingualObject('SAR', CurrencyArabicShortForm['SAR']));
            this.currency = createBilingualObject('SAR', CurrencyArabic['SAR']);
          }
        }),
        switchMap(() => {
          return this.contributionPaymentService
            .getReceiptDetails(this.registrationNumber, this.receiptNumber, false, ReceiptType.PARENT_RECEIPT)
            .pipe(
              tap(res => {
                this.receipt = res;
                this.cancelReceiptbillBatchIndicator = res.billBatchIndicator;
                if (this.cancelReceiptbillBatchIndicator) {
                  this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                  this.isEditApprove = true;
                }
                this.isOutsideGroupPresent = this.receipt.branchAmount.some(item => item.outsideGroup);
                this.isBranchPresent = this.receipt.branchAmount.some(item => !item.outsideGroup);
              })
            );
        }),
        switchMap(() => {
          return this.getDocuments();
        }),
        switchMap(() =>
          iif(
            () => this.isGccCountry && this.currencySAR.english != this.receipt.amountReceived.currency,
            this.getCurrencyDetails(this.receipt.amountReceived.currency)
          )
        ),
        switchMap(() => {
          return this.transactionService.getMCITransactions(this.registrationNumber, MCITransaction.legalEntity).pipe(
            tap(res => {
              this.transaction = res.listOfTransactionDetails;
              res.listOfTransactionDetails.forEach(item => {
                if (
                  item.transactionId === 300314 &&
                  (item.channel.english === 'mci' || item.channel.english === 'hrsd')
                ) {
                  this.getCompareDates();
                }
              });
            })
          );
        }),
        catchError(err => {
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getCompareDates() {
    for (let i = 0; i < this.transaction[i].transactionId; i++) {
      if ((this.transaction[i].transactionId = 300314)) {
        this.initialDate1 = new Date(this.transaction[i].initiatedDate?.gregorian.toString());
        this.initialDate2 = new Date(this.receipt?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 < this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      }
    }
  }

  /** Method to get currency details. */
  getCurrencyDetails(currencyCode: string): Observable<number> {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    return this.exchangeRateService
      .getExchangeRate(currencyCode, BillingConstants.CURRENCY_SAR.english, currentDate)
      .pipe(
        tap(res => {
          this.currencyDetails = assembleCurrencyDetails(this.receipt.amountReceived.amount, res, currencyCode);
          this.currency = createBilingualObject(currencyCode, CurrencyArabic[currencyCode]);
        })
      );
  }

  /** Method to get documents. */
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_ID,
        BillingConstants.CANCEL_RECEIPT_DOC_TRANSACTION_TYPE,
        this.receiptNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

  /** Method to handle error. */
  handleError(error) {
    this.alertService.showError(error.error.message);
    this.navigateToInbox();
  }

  /** Method to show modal. */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
  /** Method to confirm rejection of transaction. */
  confirmReject() {
    const workflowData = this.setWorkFlowData(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflow(workflowData, outcome);
    this.hideModal();
  }
  /** Method to confirm approval of transaction. */
  confirmApprove() {
    const outcome = WorkFlowActions.APPROVE;
    const workflowDetails = this.setWorkFlowData(TransactionOutcome.APPROVE);
    this.saveWorkflow(workflowDetails, outcome);
    this.hideModal();
  }

  /** Method to confirm return of transaction. */
  confirmReturn() {
    const workflowDataValue = this.setWorkFlowData(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowDataValue, outcome);
    this.hideModal();
  }

  /** Method to set workflow data. */
  setWorkFlowData(action: string): BPMUpdateRequest {
    const workFlowdata: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.validatorForm.get('rejectionReason'))
      workFlowdata.rejectionReason = this.validatorForm.get('rejectionReason').value;
    if (this.validatorForm.get('comments')) workFlowdata.comments = this.validatorForm.get('comments').value;
    if (this.validatorForm.get('returnReason'))
      workFlowdata.returnReason = this.validatorForm.get('returnReason').value;
    workFlowdata.taskId = this.routerData.taskId;
    workFlowdata.user = this.routerData.assigneeId;
    workFlowdata.outcome = action;
    return workFlowdata;
  }

  /** Method to save transaction in workflow. */
  /** Method to save transaction in workflow. */
  saveWorkflow(data: BPMUpdateRequest, outcome) {
    const bpmRequest = new BPMUpdateRequest();
    bpmRequest.outcome = outcome;
    bpmRequest.commentScope = 'BPM';
    bpmRequest.taskId = this.routerData.taskId;
    bpmRequest.user = this.routerData.assigneeId;
    bpmRequest.payload = this.routerData.content;
    if (data.rejectionReason) {
      bpmRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      bpmRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ENG, data.rejectionReason.english);
    }
    if (data.comments) bpmRequest.comments = data.comments;
    if (data.returnReason) bpmRequest.returnReason = data.returnReason;
    if (bpmRequest.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to get success message. */
  getSuccessMessage(action: string) {
    let message: string;
    switch (action) {
      case TransactionOutcome.APPROVE:
        message = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.RETURN:
        message = BillingConstants.TRANSACTION_RETURNED;
        break;
      case TransactionOutcome.REJECT:
        message = BillingConstants.TRANSACTION_REJECTED;
        break;
    }
    return message;
  }

  /** Method to navigate to validator edit. */
  navigateToEditScreen() {
    this.routingService.navigateToEdit();
  }

  /** Method to navigate to inbox. */
  navigateToInbox() {
    this.routingService.navigateToInbox();
  }
}
