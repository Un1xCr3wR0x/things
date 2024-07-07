/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../../shared/constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  AlertService,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  BPMMergeUpdateParamEnum,
  Transaction
} from '@gosi-ui/core';
import { ValidatorRoles, MCITransaction } from '../../../../../shared/enums';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TransactionOutcome } from '../../../../../shared/enums';
import {
  CreditBalanceDetails,
  CreditManagmentRequest,
  EstablishmentDetails,
  PenalityWavier,
  RecipientAmountDetails
} from '../../../../../shared/models';
import {
  BillingRoutingService,
  CreditManagementService,
  EstablishmentService,
  PenalityWavierService
} from '../../../../../shared/services';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';

@Component({
  selector: 'blg-credit-management-view-sc',
  templateUrl: './credit-management-view-sc.component.html',
  styleUrls: ['./credit-management-view-sc.component.scss']
})
export class CreditManagementViewScComponent implements OnInit {
  //Local variables
  validatorCreditTransferForm: FormGroup = new FormGroup({});
  creditManagementForm: FormGroup;
  modalRef: BsModalRef;
  waiverDetails: PenalityWavier;
  establishmentDetails: EstablishmentDetails;
  registrationNumber: number;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  isGOL: boolean;
  editFlag: boolean;
  documents: DocumentItem[];
  requestNo: number;
  comments: TransactionReferenceData[] = [];
  creditBalanceDetails: CreditBalanceDetails;
  creditEstDetails: CreditManagmentRequest;
  currentBalanceList = [];
  recipientDetail: RecipientAmountDetails[];
  transactionNumber: number;
  canReject: boolean;
  canReturn: boolean;
  referenceNumber: number;
  rejectHeading: string;
  returnHeading: string;
  creditAvailableBalance: boolean;
  isEdit = false;
  isEditApprove = false;
  isFcReturn = false;
  validatorRole: string;
  creditTransferbillBatchIndicator = false;
  transaction: Transaction[] = [];
  isShow = false;
  initialDate1: Date;
  initialDate2: Date;
  isDate: boolean;
  trans: Transaction;
  isReopenClosingInProgress: boolean;

  constructor(
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    private lookUpService: LookupService,
    readonly creditManagementService: CreditManagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly transactionService: TransactionService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.creditManagementForm = this.createCreditForm();
    this.getCreditTransferKeys();
    this.identifyCreditValidatorActions(this.routerDataToken.assignedRole);
    if (this.registrationNumber) this.getDataForCreditTransferView();
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.returnReasonList = this.lookUpService.getRegistrationReturnReasonList();
    this.getCreditTransferAvailableBalanceDetails(this.registrationNumber);
    this.getAllcreditDetails(this.registrationNumber, this.requestNo);
    this.getCreditScreenHeaders();
  }
  /** Method to identify validator actions. */
  identifyCreditValidatorActions(role: string): void {
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = false;
      this.editFlag = true;
      if (this.isGOL) {
        this.editFlag = false;
        this.canReturn = true;
        this.canReject = true;
      }
    }
    this.isFcReturn = false;
    if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.canReturn = true;
      this.canReject = true;
      this.isFcReturn = true;
    }
    if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
      this.isFcReturn = true;
    }
  }
  /** Method to get screen headings */
  getCreditScreenHeaders() {
    this.returnHeading = 'BILLING.RETURN-TRANSFER-CREDIT-BALANCE';
    this.rejectHeading = 'BILLING.REJECT-TRANSFER-CREDIT-BALANCE';
  }

  /** Method to read keys from token. */
  getCreditTransferKeys(): void {
    const payloads = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payloads) {
      this.requestNo = payloads.requestId ? Number(payloads.requestId) : null;
      this.isGOL = payloads.channel === 'gosi-online' ? true : false;
      this.referenceNumber = payloads.referenceNo ? Number(payloads.referenceNo) : null;
      this.registrationNumber = payloads.registrationNo ? Number(payloads.registrationNo) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
    this.validatorRole = this.routerDataToken.assignedRole;
  }
  /** Method to create a form for transaction data. */
  createCreditForm() {
    return this.fb.group({
      transactionNo: [null],
      user: [null],
      type: [null],
      taskId: [null]
    });
  }
  /** Method to get required data to view credit Transfer transaction. */
  getDataForCreditTransferView(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(resp => {
          this.establishmentDetails = resp;
          this.isReopenClosingInProgress = resp.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true: false;
          this.getCreditTransferAvailableBalanceDetails(this.registrationNumber);
        }),
        switchMap(() => {
          return this.getDocumentsForCreditTransfer();
        }),
        catchError(errs => {
          this.alertService.showError(errs.error.message);
          this.handleError(errs);
          return throwError(errs);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to get available balance details. */
  getCreditTransferAvailableBalanceDetails(registrationNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(registrationNumber).subscribe(
      datas => {
        this.creditBalanceDetails = datas;
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }
  /** Method to get documents. */
  getDocumentsForCreditTransfer(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_MANAGEMENT_ID,
        !this.isGOL
          ? BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE
          : BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE,
        this.registrationNumber,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  /** Method to handle error. */
  handleError(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveCreditTransferTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnCreditTransferTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModal() {
    this.modalRef.hide();
  }

  //Method to approve the transaction.
  confirmCreditTransferApprove() {
    const workflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowForCreditTransfer(workflowData, outcome);
    this.hideModal();
  }
  /** Method to set workflow data. */
  setWorkFlowDataForCreditTransfer(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.creditManagementForm.get('rejectionReason'))
      data.rejectionReason = this.creditManagementForm.get('rejectionReason').value;
    if (this.creditManagementForm.get('comments')) data.comments = this.creditManagementForm.get('comments').value;
    if (this.creditManagementForm.get('returnReason'))
      data.returnReason = this.creditManagementForm.get('returnReason').value;
    data.outcome = action;
    data.user = this.routerDataToken.assigneeId;
    data.taskId = this.routerDataToken.taskId;
    return data;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowForCreditTransfer(updateData: BPMUpdateRequest, outcome) {
    const bpmUpdateDataRequest = new BPMUpdateRequest();
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateDataRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.isExternalComment = this.isGOL && this.validatorRole === ValidatorRoles.VALIDATOR_ONE;
    bpmUpdateDataRequest.commentScope = 'BPM';
    bpmUpdateDataRequest.payload = this.routerDataToken.content;
    if (updateData.rejectionReason) {
      bpmUpdateDataRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ARB,
        updateData.rejectionReason.arabic
      );
      bpmUpdateDataRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
        updateData.rejectionReason.english
      );
    }
    if (updateData.comments) bpmUpdateDataRequest.comments = updateData.comments;
    if (updateData.returnReason) {
      bpmUpdateDataRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ARB, updateData.returnReason.arabic);
      bpmUpdateDataRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ENG, updateData.returnReason.english);
    }
    if (bpmUpdateDataRequest.outcome === 'REJECT' || bpmUpdateDataRequest.outcome === 'RETURN') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateDataRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForCredit(updateData.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateDataRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForCredit(updateData.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to navigate to inbox. */
  navigateToInbox() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success messages. */
  getSuccessMessageForCredit(actions: string) {
    let message: string;
    switch (actions) {
      case TransactionOutcome.REJECT:
        message = BillingConstants.TRANSACTION_REJECTED;
        break;
      case TransactionOutcome.APPROVE:
        message = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.RETURN:
        message = BillingConstants.TRANSACTION_RETURNED;
        break;
    }
    return message;
  }
  //Method to return the Transfer transaction.
  confirmCreditTransferReturn() {
    const workflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowForCreditTransfer(workflowData, outcome);
    this.hideModal();
  }

  //Method to confirm cancel transfer transaction.
  confirmCreditTransferCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  //Method to cancel the popup
  decline(): void {
    this.modalRef.hide();
  }
  /** Method to navigate to validator edits. */
  navigateToEditTransfer() {
    this.billingRoutingService.navigateToEdit();
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectCreditTransferTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  //Method to reject the transaction.
  confirmCreditTransferReject() {
    const workflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowForCreditTransfer(workflowData, outcome);
    this.hideModal();
  }

  /** Method to get all credit establishment details. */
  getAllcreditDetails(registrationNumber, requestNo) {
    this.creditManagementService.getAllCreditBalanceDetails(registrationNumber, requestNo).subscribe(
      data => {
        this.creditEstDetails = data;
        this.creditTransferbillBatchIndicator = data.billBatchIndicator;
        this.recipientDetail = data.recipientDetail;
        this.isEdit = data.haveActiveCancellationRequest;
        this.isEditApprove = data.haveActiveCancellationRequest;
        if (this.creditTransferbillBatchIndicator) {
          this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
          this.isEditApprove = true;
        }
        if (data.haveActiveCancellationRequest) this.editFlag = false;
        this.creditEstDetails.recipientDetail.forEach(res => {
          this.creditManagementService.getAvailableCreditBalance(res.registrationNo).subscribe(values => {
            this.creditBalanceDetails = values;
            if (this.creditBalanceDetails.totalCreditBalance || this.creditBalanceDetails.totalDebitBalance) {
              const obj = {
                balance:
                  this.creditBalanceDetails.totalCreditBalance !== 0
                    ? this.creditBalanceDetails.totalCreditBalance
                    : this.creditBalanceDetails.totalDebitBalance,
                regNo: res.registrationNo,
                creditBalance: this.creditBalanceDetails.totalCreditBalance !== 0 ? true : false,
                debitBalance: this.creditBalanceDetails.totalDebitBalance !== 0 ? true : false
              };
              this.currentBalanceList.push(obj);
            } else {
              const evt = {
                balance: 0,
                regNo: res.registrationNo
              };
              this.currentBalanceList.push(evt);
            }
          });
        });
        this.transactionService
          .getMCITransactions(this.registrationNumber, MCITransaction.legalEntity)
          .subscribe(res => {
            this.transaction = res.listOfTransactionDetails;
            this.getCompareDates();
          });
        this.transactionService.getMCITransactions(this.registrationNumber, MCITransaction.Delink).subscribe(res => {
          this.transaction = res.listOfTransactionDetails;
          this.getCompareDates();
        });
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  getCompareDates() {
    for (let i = 0; i < this.transaction[i]?.transactionId; i++) {
      if (
        (this.transaction[i].channel.english === 'mci' || this.transaction[i].channel.english === 'hrsd') &&
        (this.transaction[i].transactionId === 300314 || this.transaction[i].transactionId === 300318)
      ) {
        this.initialDate1 = new Date(this.transaction[i].initiatedDate?.gregorian.toString());
        this.initialDate2 = new Date(this.creditEstDetails?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 > this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      }
    }
  }
}
