/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  BilingualText,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../../shared/constants';
import { TransactionOutcome, ValidatorRoles } from '../../../../../shared/enums';
import { CreditBalanceDetails, CreditRefundDetails, EstablishmentDetails } from '../../../../../shared/models';
import {
  BillingRoutingService,
  CreditManagementService,
  EstablishmentService,
  PenalityWavierService
} from '../../../../../shared/services';

@Component({
  selector: 'blg-credit-refund-transfer-view-sc',
  templateUrl: './credit-refund-transfer-view-sc.component.html',
  styleUrls: ['./credit-refund-transfer-view-sc.component.scss']
})
export class CreditRefundTransferViewScComponent implements OnInit {
  //Local variables
  validatorForm: FormGroup = new FormGroup({});
  creditManagementForm: FormGroup;
  modalRef: BsModalRef;
  establishmentDetails: EstablishmentDetails;
  registrationNumber: number;
  isGOL: boolean;
  editFlag: boolean;
  documents: DocumentItem[];
  comments: TransactionReferenceData[] = [];
  requestNo: number;
  creditBalanceDetails: CreditBalanceDetails;
  transactionNumber: number;
  canReject: boolean;
  canReturn: boolean;
  referenceNumber: number;
  rejectHeading: string;
  returnHeading: string;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  CreditRefundDetails: CreditRefundDetails;
  iscreditRefund = false;
  isEdit = false;
  isEditApprove = false;
  bankName: BilingualText = new BilingualText();
  creditRefundbillBatchIndicator = false;
  isReopenClosingInProgress: boolean;

  constructor(
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    private lookUpService: LookupService,
    readonly billingRoutingService: BillingRoutingService,
    readonly creditManagementService: CreditManagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.creditManagementForm = this.createCreditForm();
    this.getCreditKeys();
    if (this.routerDataToken) {
      if (this.routerDataToken.initiatorRoleId === Role.CUSTOMER_SERVICE_SUPERVISOR) this.iscreditRefund = true;
    }
    this.identifyCreditValidatorActions(this.routerDataToken.assignedRole);
    this.returnReasonList = this.lookUpService.getRegistrationReturnReasonList();
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();

    if (this.registrationNumber) this.getDataForView();
    this.getAllcreditDetails(this.registrationNumber, this.requestNo);
    this.getCreditScreenHeaders();
  }

  /** Method to read keys from token. */
  getCreditKeys(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.requestNo = payload.requestId ? Number(payload.requestId) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyCreditValidatorActions(role: string): void {
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = this.isGOL;
      this.editFlag = !this.isGOL;
    }
    if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
    }
    if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.canReturn = true;
      this.canReject = true;
    }
  }

  /** Method to get screen headings */
  getCreditScreenHeaders() {
    this.rejectHeading = 'BILLING.REJECT-CREDIT-REFUND-BALANCE';
    this.returnHeading = 'BILLING.RETURN-CREDIT-REFUND-BALANCE';
  }
  /** Method to create a form for transaction data. */
  createCreditForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }
  /** Method to get required data to view transaction. */
  getDataForView(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishmentDetails = res;
          this.isReopenClosingInProgress = res.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true: false;
        }),
        switchMap(() => {
          return this.getDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);

  }
  /** Method to get available baalnce details. */
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(
      data => {
        this.creditBalanceDetails = data;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /** Method to get documents. */
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_ID,
        BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE,
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
  approveCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  /**----Method to get contributor IBAN details */
  getContributorDetails(iBanCode: string) {
    this.lookUpService.getBankForIban(iBanCode.slice(4, 6)).subscribe(
      res => {
        this.bankName = res.items[0]?.value;
      },
      err => this.handleError(err)
    );
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
  confirmCreditApprove() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowForCreditRefund(workflowData, outcome);
    this.hideModal();
  }
  /** Method to set workflow data. */
  setWorkFlowDataForCredit(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.creditManagementForm.get('comments')) data.comments = this.creditManagementForm.get('comments').value;
    if (this.creditManagementForm.get('rejectionReason'))
      data.rejectionReason = this.creditManagementForm.get('rejectionReason').value;
    if (this.creditManagementForm.get('returnReason')) {
      data.returnReason = this.creditManagementForm.get('returnReason').value;
      data.returnReason.english = `${data.returnReason.english}(${data.comments})`;
      data.returnReason.arabic = `(${data.comments})${data.returnReason.arabic}`;
    }
    data.user = this.routerDataToken.assigneeId;
    data.outcome = action;
    data.taskId = this.routerDataToken.taskId;
    return data;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowForCreditRefund(dataRequest: BPMUpdateRequest, outcome) {
    const bpmUpdateCreditRequest = new BPMUpdateRequest();
    bpmUpdateCreditRequest.outcome = outcome;
    bpmUpdateCreditRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateCreditRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateCreditRequest.outcome = outcome;
    bpmUpdateCreditRequest.commentScope = 'BPM';
    bpmUpdateCreditRequest.payload = this.routerDataToken.content;
    if (dataRequest.rejectionReason) {
      bpmUpdateCreditRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ARB,
        dataRequest.rejectionReason.arabic
      );
      bpmUpdateCreditRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
        dataRequest.rejectionReason.english
      );
    }

    if (dataRequest.comments) bpmUpdateCreditRequest.comments = dataRequest.comments;
    if (dataRequest.returnReason) {
      bpmUpdateCreditRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ARB, dataRequest.returnReason.arabic);
      bpmUpdateCreditRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ENG, dataRequest.returnReason.english);
    }
    if (bpmUpdateCreditRequest.outcome === 'REJECT' || bpmUpdateCreditRequest.outcome === 'RETURN') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateCreditRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForCredit(dataRequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateFromCreditToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateCreditRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForCredit(dataRequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateFromCreditToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to navigate to inbox. */
  navigateFromCreditToInbox() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success message. */
  getSuccessMessageForCredit(action: string) {
    let message: string;
    switch (action) {
      case TransactionOutcome.APPROVE:
        message = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.REJECT:
        message = BillingConstants.TRANSACTION_REJECTED;
        break;
      case TransactionOutcome.RETURN:
        message = BillingConstants.TRANSACTION_RETURNED;
        break;
    }
    return message;
  }
  //Method to return the transaction.
  confirmCreditReturn() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowForCreditRefund(workflowData, outcome);
    this.hideModal();
  }

  //Method to confirm cancel the transaction.
  confirmCreditCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  //*@memberof ValidatorScComponent
  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.creditManagementForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  //Method to reject the transaction.
  confirmCreditReject() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowForCreditRefund(workflowData, outcome);
    this.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.billingRoutingService.navigateToEdit();
  }
  /** Method to get all credit establishment details. */
  getAllcreditDetails(registrationNumber, requestNo) {
    this.creditManagementService.getRefundDetails(registrationNumber, requestNo).subscribe(
      data => {
        this.CreditRefundDetails = data;
        this.creditRefundbillBatchIndicator = data.billBatchIndicator;
        this.isEdit = this.CreditRefundDetails.haveActiveCancellationRequest;
        this.isEditApprove = this.CreditRefundDetails.haveActiveCancellationRequest;
        if (this.creditRefundbillBatchIndicator) {
          this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
          this.isEditApprove = true;
        }

        if (this.CreditRefundDetails.haveActiveCancellationRequest) this.editFlag = false;
        this.getContributorDetails(this.CreditRefundDetails.iban);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
}
