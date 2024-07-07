/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { noop, Observable, throwError } from 'rxjs';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';
import { BillingConstants } from '../../../../shared/constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  Transaction,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MCITransaction, TransactionOutcome, ValidatorRoles } from '../../../../shared/enums';
import { BillingRoutingService, EstablishmentService, PenalityWavierService } from '../../../../shared/services';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';

@Component({
  selector: 'blg-validate-waive-establishment-penalty-sc',
  templateUrl: './validate-waive-establishment-penalty-sc.component.html',
  styleUrls: ['./validate-waive-establishment-penalty-sc.component.scss']
})
export class ValidateWaiveEstablishmentPenaltyScComponent implements OnInit {
  //Local variables
  validatorForm: FormGroup = new FormGroup({});
  waivePenaltyEstablishmentForm: FormGroup;
  modalRef: BsModalRef;
  waiverDetails: PenalityWavier;
  establishmentDetails: EstablishmentDetails;
  penaltyWaiveId: number;
  registrationNumber: number;
  transactionNumber: number;
  canReject: boolean;
  canReturn: boolean;
  referenceNumber: number;
  rejectHeading: string;
  returnHeading: string;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  isGOL: boolean;
  editFlag = true;
  documents: DocumentItem[];
  exceptionalSocietyFlag = false;
  comments: TransactionReferenceData[] = [];
  isFcApprove = false;
  isGdic = false;
  penaltybillBatchIndicator = false;
  isEditApprove = false;
  transaction: Transaction[] = [];
  isShow = false;
  initialDate1: Date;
  initialDate2: Date;
  isDate: boolean;
  trans: Transaction;
  isReopenClosingInProgress: boolean;
  isPPA: boolean;

  constructor(
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    private lookUpService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly transactionService: TransactionService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.waivePenaltyEstablishmentForm = this.createForm();
    this.getKeysFromToken();
    this.identifyValidatorActions(this.routerDataToken.assignedRole);

    if (this.penaltyWaiveId && this.registrationNumber) this.getDataForView();
    if (this.routerDataToken.assignedRole === ValidatorRoles.GDIC) {
      this.returnReasonList = this.lookUpService.getCollectionReturnReasonList();
    } else {
      this.returnReasonList = this.lookUpService.getRegistrationReturnReasonList();
    }
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.getScreenValues();
  }

  /** Method to read keys from token. */
  getKeysFromToken(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyValidatorActions(role: string): void {
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReturn = false;
      this.canReject = true;
      if (this.isGOL) {
        this.canReturn = true;
        this.editFlag = false;
      }
      this.isGdic = false;
      this.isFcApprove = false;
    } else if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReject = false;
      this.canReturn = true;
      this.editFlag = false;
      this.isFcApprove = true;
      this.isGdic = false;
    } else if (
      role === ValidatorRoles.GDIC ||
      role === ValidatorRoles.GDES ||
      role === ValidatorRoles.AG ||
      role === ValidatorRoles.GOVERNOR
    ) {
      this.canReject = false;
      this.editFlag = false;
      this.canReturn = true;
    } else if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.editFlag = false;
      this.canReject = true;
      this.canReturn = true;
      this.isFcApprove = true;
      this.isGdic = false;
    }
  }
  /** Method to get screen headings */
  getScreenValues() {
    this.returnHeading = 'BILLING.RETURN-WAIVE-ESTABLISHMENT-LATE-FEES';
    this.rejectHeading = 'BILLING.REJECT-WAIVE-ESTABLISHMENT-LATE-FEES';
  }
  /** Method to create a form for transaction data. */
  createForm() {
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
          this.isPPA = res.ppaEstablishment;
          this.isReopenClosingInProgress = res.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
        }),
        switchMap(() => {
          return this.penalityWavierService
            .getWavierPenalityDetailsForView(this.registrationNumber, this.penaltyWaiveId)
            .pipe(
              tap(res => {
                this.waiverDetails = res;
                this.exceptionalSocietyFlag = this.waiverDetails.exceptionalSociety;
                this.penaltybillBatchIndicator = res.billBatchIndicator;
                if (this.penaltybillBatchIndicator) {
                  this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                  this.isEditApprove = true;
                }
              })
            );
        }),
        switchMap(() => {
          return this.getDocuments();
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
        catchError(err => {
          this.alertService.showError(err.error.message);
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
        this.initialDate2 = new Date(this.waiverDetails?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 > this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      }
    }
  }

  /** Method to get documents. */
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        !this.isGOL
          ? this.exceptionalSocietyFlag
            ? BillingConstants.PENALTY_WAVIER_SPCL_GOL_FO_DOC_TRANSACTION_TYPE
            : BillingConstants.PENALTY_WAVIER_FO_DOC_TRANSACTION_TYPE
          : BillingConstants.PENALTY_WAVIER_GOL_DOC_TRANSACTION_TYPE,
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
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showPopup(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showPopup(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showPopup(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hidePopup() {
    this.modalRef.hide();
  }

  //Method to approve the transaction.
  confirmApprove() {
    const workflowData = this.setWorkFlowData(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hidePopup();
  }
  /** Method to set workflow data. */
  setWorkFlowData(action: string): BPMUpdateRequest {
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.waivePenaltyEstablishmentForm.get('returnReason'))
      bpmUpdateRequest.returnReason = this.waivePenaltyEstablishmentForm.value.returnReason;
    if (this.waivePenaltyEstablishmentForm.get('comments'))
      bpmUpdateRequest.comments = this.waivePenaltyEstablishmentForm.value.comments;
    if (this.waivePenaltyEstablishmentForm.get('rejectionReason'))
      bpmUpdateRequest.rejectionReason = this.waivePenaltyEstablishmentForm.value.rejectionReason;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.outcome = action;
    return bpmUpdateRequest;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowDetails(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.payload = this.routerDataToken.content;
    bpmUpdateRequest.isExternalComment =
      this.isGOL && this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR_ONE;
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.commentScope = 'BPM';
    if (data.returnReason) bpmUpdateRequest.returnReason = data.returnReason;
    if (data.rejectionReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ENG, data.rejectionReason.english);
    }
    if (data.comments) bpmUpdateRequest.comments = data.comments;
    if (bpmUpdateRequest.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateBacktoInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateBacktoInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to navigate to inbox. */
  navigateBacktoInbox() {
    this.billingRoutingService.navigateToInbox();
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
  //Method to return the transaction.
  confirmReturn() {
    const workflowData = this.setWorkFlowData(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hidePopup();
  }
  //*@memberof ValidatorScComponent
  decline(): void {
    this.modalRef.hide();
  }
  //Method to confirm cancel the transaction.
  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyEstablishmentForm.updateValueAndValidity();
    this.showPopup(templateRef);
  }
  //Method to reject the transaction.
  confirmReject() {
    const workflowData = this.setWorkFlowData(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hidePopup();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.billingRoutingService.navigateToEdit();
  }
}
