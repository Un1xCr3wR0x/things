/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  DocumentService,
  RouterDataToken,
  RouterData,
  scrollToTop,
  AlertService,
  LovList,
  LookupService,
  RouterConstants,
  BPMUpdateRequest,
  DocumentItem,
  WorkflowService,
  WorkFlowActions,
  TransactionReferenceData,
  BPMMergeUpdateParamEnum,
  Transaction
} from '@gosi-ui/core';
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MCITransaction, TransactionOutcome, ValidatorRoles } from '../../../../shared/enums';
import { Router } from '@angular/router';
import { BillingConstants } from '../../../../shared/constants';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, Observable, noop } from 'rxjs';
import { EstablishmentService } from '../../../../shared/services';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BillingRoutingService, PenalityWavierService } from '../../../../shared/services';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';

@Component({
  selector: 'blg-establishment-exceptional-penalty-sc',
  templateUrl: './establishment-exceptional-penalty-sc.component.html',
  styleUrls: ['./establishment-exceptional-penalty-sc.component.scss']
})
export class EstablishmentExceptionalPenaltyScComponent implements OnInit {
  //Local variables
  vicExceptionalFlag = false;
  modalRef: BsModalRef;
  registrationNumber: number;
  transactionNumber: number;
  validatorForm: FormGroup = new FormGroup({});
  waivePenaltyEstablishmentForm: FormGroup;
  canReject: boolean;
  canReturn: boolean;
  rejectHeading: string;
  comments: TransactionReferenceData[] = [];
  returnHeading: string;
  editFlag = true;
  waiverDetails: PenalityWavier;
  establishmentDetails: EstablishmentDetails;
  penaltyWaiveId: number;
  documents: DocumentItem[];
  referenceNumber: number;
  fcReturnFlag: boolean;
  exceptionalbillBatchIndicator = false;
  isEditApprove = false;
  transaction: Transaction[] = [];
  isShow = false;
  isPPA: boolean;
  rejectReasonLists: Observable<LovList>;
  returnReasonLists: Observable<LovList>;
  initialDate1: Date;
  initialDate2: Date;
  isDate: boolean;
  trans: Transaction;
  isReopenClosingInProgress: boolean;

  constructor(
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    readonly establishmentService: EstablishmentService,
    private lookUpService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly transactionService: TransactionService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.waivePenaltyEstablishmentForm = this.createForms();
    this.getKeysFromTokens();
    this.identifyValidatorActionDetails(this.routerDataToken.assignedRole);
    console.log(this.routerDataToken)
    if (this.penaltyWaiveId && this.registrationNumber) this.getDataForViews();
    if (this.routerDataToken.assignedRole === ValidatorRoles.GDIC) {
      this.returnReasonLists = this.lookUpService.getCollectionReturnReasonList();
    } else {
      this.returnReasonLists = this.lookUpService.getRegistrationReturnReasonList();
    }
    this.rejectReasonLists = this.lookUpService.getEstablishmentRejectReasonList();

    this.getScreenHeader();
  }

  /** Method to read keys from token. */
  getKeysFromTokens(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyValidatorActionDetails(role: string): void {
    if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
      this.canReject = false;
      this.fcReturnFlag = true;
    } else if (role === ValidatorRoles.GDES || role === ValidatorRoles.GDISOFULLNAME) {
      this.canReturn = true;
      this.canReject = true;
      this.fcReturnFlag = false;
    } else if (role === ValidatorRoles.GDIC) {
      this.canReturn = false;
      this.canReject = false;
    } else if (role === ValidatorRoles.AG || role === ValidatorRoles.GOVERNOR) {
      this.canReturn = true;
      this.canReject = false;
    }
  }
  /** Method to get screen headings */
  getScreenHeader() {
    this.rejectHeading = 'BILLING.REJECT-WAIVE-ESTABLISHMENT-LATE-FEES';
    this.returnHeading = 'BILLING.RETURN-WAIVE-ESTABLISHMENT-LATE-FEES';
  }
  /** Method to create a form for transaction data. */
  createForms() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }

  /** Method to get documents. */
  getEstablishmentDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.registrationNumber,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /** Method to get required data to view transaction. */
  getDataForViews(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(response => {
          this.establishmentDetails = response;
          this.isPPA = response.ppaEstablishment;
          this.isReopenClosingInProgress = response.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
        }),
        switchMap(() => {
          return this.penalityWavierService
            .getWavierPenalityDetailsForView(this.registrationNumber, this.penaltyWaiveId)
            .pipe(
              tap(resp => {
                this.waiverDetails = resp;
                this.exceptionalbillBatchIndicator = resp.billBatchIndicator;
                if (this.exceptionalbillBatchIndicator) {
                  this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                  this.isEditApprove = true;
                }
              })
            );
        }),
        switchMap(() => {
          return this.getEstablishmentDocuments();
        }),
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
        catchError(error => {
          this.alertService.showError(error.error.message);
          this.handleErrors(error);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }
  getCompareDates() {
    for (let i = 0; i < this.transaction[i].transactionId; i++) {
      if ((this.transaction[i].transactionId = 300314)) {
        this.initialDate1 = new Date(this.transaction[i].initiatedDate?.gregorian.toString());
        this.initialDate2 = new Date(this.waiverDetails?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 < this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      }
    }
  }
  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  //Method to confirm cancel the transaction.
  confirmCancels() {
    this.declineCancel();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModals() {
    this.modalRef.hide();
  }

  //Method to approve the transaction.
  confirmApproves() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData, outcome);
    this.hideModals();
  }
  /** Method to set workflow data. */
  setWorkFlowDatas(action: string): BPMUpdateRequest {
    const value: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.waivePenaltyEstablishmentForm.get('rejectionReason'))
      value.rejectionReason = this.waivePenaltyEstablishmentForm.get('rejectionReason').value;
    if (this.waivePenaltyEstablishmentForm.get('comments'))
      value.comments = this.waivePenaltyEstablishmentForm.get('comments').value;
    if (this.waivePenaltyEstablishmentForm.get('returnReason'))
      value.returnReason = this.waivePenaltyEstablishmentForm.get('returnReason').value;
    value.taskId = this.routerDataToken.taskId;
    value.user = this.routerDataToken.assigneeId;
    value.outcome = action;
    return value;
  }
  //Method to reject the transaction.
  confirmRejects() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflow(workflowData, outcome);
    this.hideModals();
  }
  /** Method to save transaction in workflow. */
  saveWorkflow(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.payload = this.routerDataToken.content;
    bpmUpdateRequest.commentScope = 'BPM';
    if (data.rejectionReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ENG, data.rejectionReason.english);
    }
    if (data.returnReason) bpmUpdateRequest.returnReason = data.returnReason;
    if (data.comments) bpmUpdateRequest.comments = data.comments;
    if (bpmUpdateRequest.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessages(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInboxes();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessages(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInboxes();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /** Method to navigate to inbox. */
  navigateToInboxes() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success message. */
  getSuccessMessages(action: string) {
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
  confirmReturns() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData, outcome);
    this.hideModals();
  }

  //*@memberof ValidatorScComponent
  declineCancel(): void {
    this.modalRef.hide();
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /** Method to navigate to validator edit. */
  navigateToEdits() {
    this.billingRoutingService.navigateToEdit();
  }
}
