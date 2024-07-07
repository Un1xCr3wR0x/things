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
  TransactionReferenceData,
  BPMMergeUpdateParamEnum
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BillingRoutingService, PenalityWavierService } from '../../../../shared/services';
import { EstablishmentService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, noop, Observable } from 'rxjs';
import { PenalityWavier } from '../../../../shared/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';
import { ValidatorRoles } from '@gosi-ui/features/collection/billing/lib/shared/enums';

@Component({
  selector: 'blg-vic-exceptional-penalty-sc',
  templateUrl: './vic-exceptional-penalty-sc.component.html',
  styleUrls: ['./vic-exceptional-penalty-sc.component.scss']
})
export class VicExceptionalPenaltyScComponent implements OnInit {
  //Local variables
  documents: DocumentItem[];
  validatorForms: FormGroup = new FormGroup({});
  vicExceptionalFlag = true;
  socialInsuranceno: number;
  penaltyWaiveId: number;
  transactionNumber: number;
  waiverDetails: PenalityWavier;
  modalRef: BsModalRef;
  rejectHeadingValue: string;
  exceptionalVicForm: FormGroup;
  comments: TransactionReferenceData[] = [];
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  canReject: boolean;
  canReturn: boolean;
  returnHeadingValue: string;
  referenceNumber: number;
  fcReturnFlag: boolean;

  constructor(
    private fb: FormBuilder,
    readonly penaltyWaiverService: PenalityWavierService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    private lookUpService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.exceptionalVicForm = this.createVicForm();
    this.identifyTheRoles(this.routerDataToken.assignedRole);
    this.getScreenHeaders();
    this.getValuesFromToken();
    if (this.penaltyWaiveId && this.socialInsuranceno) this.getDataForVicExceptionalView();
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.returnReasonList = this.lookUpService.getRegistrationReturnReasonList();
  }

  /** Method to read keys from token. */
  getValuesFromToken(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.socialInsuranceno = payload.sin ? Number(payload.sin) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.penaltyWaiveId = payload.waiverId ? Number(payload.waiverId) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }
  /** Method to identify validator actions. */
  identifyTheRoles(role: string): void {
    if (role === ValidatorRoles.GDES || role === ValidatorRoles.GDISOFULLNAME) {
      this.canReject = true;
      this.canReturn = true;
      this.fcReturnFlag = false;
    } else if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReject = false;
      this.canReturn = true;
      this.fcReturnFlag = true;
    } else if (role === ValidatorRoles.GDIC) {
      this.canReturn = false;
      this.canReject = false;
    }
  }
  /** Method to get required data to view transaction. */
  getDataForVicExceptionalView(): void {
    this.penaltyWaiverService
      .getExceptionalVicDetails(this.socialInsuranceno, this.penaltyWaiveId)
      .pipe(
        tap(res => {
          this.waiverDetails = res;
        }),
        switchMap(() => {
          return this.getVicDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to get documents. */
  getVicDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.socialInsuranceno,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

  /** Method to get screen headings */
  getScreenHeaders() {
    this.rejectHeadingValue = 'BILLING.REJECT-EXCEPTIONAL-VIC';
    this.returnHeadingValue = 'BILLING.RETURN-EXCEPTIONAL-VIC';
  }
  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveVicTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalVicForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectVicTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalVicForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnVicTransactions(templateRef: TemplateRef<HTMLElement>) {
    this.exceptionalVicForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  //Method to confirm cancel the transaction.
  confirmCancelBtn() {
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

  hideModals() {
    this.modalRef.hide();
  }
  /** Method to create a form for transaction data. */
  createVicForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }
  //Method to approve the transaction.
  confirmApproveForVic() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModals();
  }
  /** Method to set workflow data. */
  setWorkFlowDatas(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.exceptionalVicForm.get('rejectionReason'))
      data.rejectionReason = this.exceptionalVicForm.get('rejectionReason').value;
    if (this.exceptionalVicForm.get('comments')) data.comments = this.exceptionalVicForm.get('comments').value;
    if (this.exceptionalVicForm.get('returnReason'))
      data.returnReason = this.exceptionalVicForm.get('returnReason').value;
    data.taskId = this.routerDataToken.taskId;
    data.user = this.routerDataToken.assigneeId;
    data.outcome = action;
    return data;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowDetails(dataReq: BPMUpdateRequest, outcome) {
    const bpmUpdateRequestValue = new BPMUpdateRequest();
    bpmUpdateRequestValue.payload = this.routerDataToken.content;
    bpmUpdateRequestValue.outcome = outcome;
    bpmUpdateRequestValue.user = this.routerDataToken.assigneeId;
    bpmUpdateRequestValue.taskId = this.routerDataToken.taskId;
    bpmUpdateRequestValue.commentScope = 'BPM';
    if (dataReq.rejectionReason) {
      bpmUpdateRequestValue.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, dataReq.rejectionReason.arabic);
      bpmUpdateRequestValue.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
        dataReq.rejectionReason.english
      );
    }
    if (dataReq.returnReason) bpmUpdateRequestValue.returnReason = dataReq.returnReason;
    if (dataReq.comments) bpmUpdateRequestValue.comments = dataReq.comments;
    if (bpmUpdateRequestValue.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequestValue).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForView(dataReq.outcome);
          this.alertService.showSuccessByKey(successMessage);
          this.navToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequestValue, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForView(dataReq.outcome);
          this.alertService.showSuccessByKey(successMessage);
          this.navToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to navigate to inbox. */
  navToInbox() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success message. */
  getSuccessMessageForView(action: string) {
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
  confirmReturnForVic() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModals();
  }
  //Method to reject the transaction.
  confirmRejectForVic() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowDetails(workflowData, outcome);
    this.hideModals();
  }
}
