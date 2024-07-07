/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {
  DocumentService,
  RouterDataToken,
  RouterData,
  AlertService,
  scrollToTop,
  RouterConstants,
  BPMUpdateRequest,
  LookupService,
  LovList,
  DocumentItem,
  WorkflowService,
  WorkFlowActions,
  TransactionReferenceData
} from '@gosi-ui/core';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';
import { ValidatorRoles } from '../../../../shared/enums';
import { EstablishmentService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, noop, Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BillingRoutingService, PenalityWavierService } from '../../../../shared/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PenaltyWaiverSegmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-exceptional-buklk-penalty-sc',
  templateUrl: './exceptional-bulk-penalty-sc.component.html',
  styleUrls: ['./exceptional-bulk-penalty-sc.component.scss']
})
export class ExceptionalPenaltyBulkScComponent implements OnInit {
  //Local variables
  penaltyWaiveId: number;
  transactionNumber: number;
  waiverDetails: PenaltyWaiverSegmentRequest;
  documents: DocumentItem[];
  bullkvalidatorForms: FormGroup = new FormGroup({});
  vicExceptionalFlag = true;
  comments: TransactionReferenceData[] = [];
  rejectReasonLists: Observable<LovList>;
  returnReasonLists: Observable<LovList>;
  canReject: boolean;
  canReturn: boolean;
  returnHeadingValue: string;
  referenceNumber: number;
  modalRef: BsModalRef;
  rejectHeadingValue: string;
  exceptionalBulkForm: FormGroup;
  fcReturnFlag: boolean;

  constructor(
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly penaltyWaiverService: PenalityWavierService,
    readonly establishmentService: EstablishmentService,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    private lookUpService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.exceptionalBulkForm = this.createBulkForm();
    this.getScreenHeaders();
    this.identifyTheRolesForBulk(this.routerDataToken.assignedRole);
    this.getValuesFromTokenForBulk();
    if (this.penaltyWaiveId) this.getDataForBulkExceptionalView();
    this.rejectReasonLists = this.lookUpService.getEstablishmentRejectReasonList();
    this.returnReasonLists = this.lookUpService.getRegistrationReturnReasonList();
  }

  /** Method to read keys from token. */
  getValuesFromTokenForBulk(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyTheRolesForBulk(role: string): void {
    if (role === ValidatorRoles.GDES) {
      this.canReject = true;
      this.canReturn = true;
      this.fcReturnFlag = false;
    } else if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
      this.canReject = false;
      this.fcReturnFlag = true;
    } else if (role === ValidatorRoles.GDIC) {
      this.canReturn = false;
      this.canReject = false;
    }
  }
  /** Method to get required data to view transaction. */
  getDataForBulkExceptionalView(): void {
    this.penaltyWaiverService
      .getExceptionalBulkDetails(this.penaltyWaiveId)
      .pipe(
        tap(res => {
          this.waiverDetails = res;
        }),
        switchMap(() => {
          return this.getBulkDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleErrorsForBulk(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to get documents. */
  getBulkDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.penaltyWaiveId,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

  /** Method to handle error. */
  handleErrorsForBulk(error) {
    this.alertService.showError(error.error.message);
  }
  /** Method to get screen headings */
  getScreenHeaders() {
    this.returnHeadingValue = 'BILLING.RETURN-EXCEPTIONAL-LATE-FEE-WAIVER';
    this.rejectHeadingValue = 'BILLING.REJECT-EXCEPTIONAL-LATE-FEE-WAIVER';
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveBulkTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalBulkForm.updateValueAndValidity();
    this.showModalsForBulk(templateRef);
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectBulkTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalBulkForm.updateValueAndValidity();
    this.showModalsForBulk(templateRef);
  }
  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnBulkTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalBulkForm.updateValueAndValidity();
    this.showModalsForBulk(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModalsForBulk(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  //Method to confirm cancel the transaction.
  confirmCancelBtns() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  //*@memberof ValidatorScComponent
  decline(): void {
    this.modalRef.hide();
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModalsForBulk() {
    this.modalRef.hide();
  }
  /** Method to create a form for transaction data. */
  createBulkForm() {
    return this.fb.group({
      user: [null],
      type: [null],
      taskId: [null],
      transactionNo: [null]
    });
  }
  //Method to approve the transaction.
  confirmApproveForBulk() {
    const workflowData = this.setWorkFlowDatasForBulk(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModalsForBulk();
  }
  /** Method to set workflow data. */
  setWorkFlowDatasForBulk(action: string): BPMUpdateRequest {
    const bpmdata: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.exceptionalBulkForm.get('returnReason'))
      bpmdata.returnReason = this.exceptionalBulkForm.get('returnReason').value;
    if (this.exceptionalBulkForm.get('rejectionReason'))
      bpmdata.rejectionReason = this.exceptionalBulkForm.get('rejectionReason').value;
    if (this.exceptionalBulkForm.get('comments')) bpmdata.comments = this.exceptionalBulkForm.get('comments').value;
    bpmdata.outcome = action;
    bpmdata.taskId = this.routerDataToken.taskId;
    bpmdata.user = this.routerDataToken.assigneeId;
    return bpmdata;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowDetails(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.commentScope = 'BPM';
    if (data.rejectionReason) bpmUpdateRequest.rejectionReason = data.rejectionReason;
    if (data.returnReason) bpmUpdateRequest.returnReason = data.returnReason;
    if (data.comments) bpmUpdateRequest.comments = data.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
      () => {
        const successMessages = this.getSuccessMessageForViewForBulk(data.outcome);
        this.alertService.showSuccessByKey(successMessages, null, 5);
        this.navToInboxPage();
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /** Method to navigate to inbox. */
  navToInboxPage() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success message. */
  getSuccessMessageForViewForBulk(actions: string) {
    let message: string;
    switch (actions) {
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
  confirmReturnForBulk() {
    const workflowData = this.setWorkFlowDatasForBulk(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModalsForBulk();
  }
  //Method to reject the transaction.
  confirmRejectForBulk() {
    const workflowData = this.setWorkFlowDatasForBulk(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModalsForBulk();
  }
}
