import { TemplateRef } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, BPMMergeUpdateParamEnum, BPMUpdateRequest, DocumentItem, DocumentService, LookupService, LovList, RouterConstants, RouterData, RouterDataToken, scrollToTop, TransactionReferenceData, WorkFlowActions, WorkflowService } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants';
import { TransactionOutcome, ValidatorRoles } from '../../../../shared/enums';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';
import { BillingRoutingService, EstablishmentService, PenalityWavierService } from '../../../../shared/services';

@Component({
  selector: 'blg-violation-late-fee-sc',
  templateUrl: './violation-late-fee-sc.component.html',
  styleUrls: ['./violation-late-fee-sc.component.scss']
})
export class ViolationLateFeeScComponent implements OnInit {
  waivePenaltyViolationEstablishmentForm: FormGroup;
  referenceNumber: number;
  registrationNumber: number;
  penaltyWaiveId: number;
  isGOL: boolean;
  comments: TransactionReferenceData[] = [];
  transactionNumber: number;
  establishmentDetails: EstablishmentDetails;
  waiverDetails: PenalityWavier;
  documents: DocumentItem[];
  penaltybillBatchIndicator = false;
  isLateFeeViolation = true;
  modalRef: BsModalRef;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  canReturn: boolean;
  canReject: boolean;
  editFlag = true;
  isFcApprove = false;
  isGdic = false;
  isEditApprove = false;
  returnHeading: string;
  rejectHeading: string;
  exceptionalSocietyFlag = false;
  constructor(
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly penalityWavierService: PenalityWavierService,
    readonly router: Router,
    private fb: FormBuilder,
    private lookUpService: LookupService,
    readonly workflowService: WorkflowService,
    readonly billingRoutingService: BillingRoutingService,
    readonly documentService: DocumentService
  ) { }

  ngOnInit(): void {
    scrollToTop();
    this.waivePenaltyViolationEstablishmentForm = this.createForm();
    this.getKeysFromToken();
    this.identifyValidatorActions(this.routerDataToken.assignedRole);
    if (this.penaltyWaiveId && this.registrationNumber) this.getDataForView();
    if (this.routerDataToken.assignedRole === ValidatorRoles.GDIC) {
      this.returnReasonList = this.lookUpService.getCollectionReturnReasonList();
    } else {
      this.returnReasonList = this.lookUpService.getGosiInitiativeReturnReasonList();
    }
    this.rejectReasonList = this.lookUpService.getGosiInitiativeRejectReasonList();
    this.getScreenValues();
  }
  /** Method to identify validator actions */
  identifyValidatorActions(role: string): void {
    if(role === ValidatorRoles.VALIDATOR_ONE){
      this.canReturn = false;
      this.canReject = true;
    
    if(this.isGOL){
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
  } else if (role === ValidatorRoles.GDIC) {
    this.canReject = false;
    this.editFlag = false;
    this.canReturn = true;
    if (!this.isGOL) this.editFlag = true;
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
  getKeysFromToken() {
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
        }),
        switchMap(() => {
          return this.penalityWavierService
            .getWavierPenalityDetailsForView(this.registrationNumber, this.penaltyWaiveId)
            .pipe(
              tap(res => {
                this.waiverDetails = res;
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
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
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
    decline(): void {
      this.modalRef.hide();
    }
      //Method to confirm cancel the transaction.
  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
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
    const workflowData = this.setWorkFlowDataForLateFeeViolation(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowDetailsForLateFeeViolation(workflowData, outcome);
    this.hidePopup();
  }
  /** Method to save transaction in workflow.  */
  saveWorkflowDetailsForLateFeeViolation(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.payload = this.routerDataToken.content;
    bpmUpdateRequest.isExternalComment = this.isGOL && this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR_ONE;
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.commentScope = 'BPM';
    if (data.returnReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ARB, data.returnReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ENG, data.returnReason.english);
    }
    if (data.rejectionReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ENG, data.rejectionReason.english);
    }
    if (data.comments) bpmUpdateRequest.comments = data.comments;
    if (bpmUpdateRequest.outcome === 'REJECT' || bpmUpdateRequest.outcome === 'RETURN') {
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
  navigateBacktoInbox() {
    this.billingRoutingService.navigateToInbox();
  }
  /** Method to get success message. */
  getSuccessMessage(outcome: string) {
    let message : string;
    switch(outcome) {
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
  /** Method to set data in workflow.  */
  setWorkFlowDataForLateFeeViolation(action: string): BPMUpdateRequest  {
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    if(this.waivePenaltyViolationEstablishmentForm.get('returnReason'))
    bpmUpdateRequest.returnReason = this.waivePenaltyViolationEstablishmentForm.get('returnReason').value;
    if(this.waivePenaltyViolationEstablishmentForm.get('rejectionReason'))
    bpmUpdateRequest.rejectionReason = this.waivePenaltyViolationEstablishmentForm.value.rejectionReason;
    if (this.waivePenaltyViolationEstablishmentForm.get('comments'))
    bpmUpdateRequest.comments = this.waivePenaltyViolationEstablishmentForm.value.comments;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.outcome = action;
    return bpmUpdateRequest ;
  }
   //Method to reject the transaction.
   confirmReject() {
    const workflowData = this.setWorkFlowDataForLateFeeViolation(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowDetailsForLateFeeViolation(workflowData, outcome);
    this.hidePopup();
  }
   /**
   * Method to show approve modal.
   * @param templateRef
   */
   approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyViolationEstablishmentForm.updateValueAndValidity();
    this.showPopup(templateRef);
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.waivePenaltyViolationEstablishmentForm.updateValueAndValidity();
    this.showPopup(templateRef);
  }
    /**
   * Method to show return modal.
   * @param templateRef
   */
    returnTransaction(templateRef: TemplateRef<HTMLElement>) {
      this.waivePenaltyViolationEstablishmentForm.updateValueAndValidity();
      this.showPopup(templateRef);
    }
   /**
   * This method is to show the modal reference.
   * @param modalRef
   */
   showPopup(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
   //Method to return the transaction.
   confirmReturn() {
    const workflowData = this.setWorkFlowDataForLateFeeViolation(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowDetailsForLateFeeViolation(workflowData, outcome);
    this.hidePopup();
  }
}

