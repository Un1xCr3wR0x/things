import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  LovList,
  scrollToTop,
  TransactionReferenceData,
  RouterDataToken,
  RouterData,
  LookupService,
  WorkFlowActions,
  BPMUpdateRequest,
  BPMMergeUpdateParamEnum,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EstablishmentDetails, MiscellaneousRequest } from '../../../../shared/models';
import {
  EstablishmentService,
  MiscellaneousAdjustmentService,
  BillingRoutingService
} from '../../../../shared/services';
import { ValidatorRoles, TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-validate-miscellaneous-adjustment-sc',
  templateUrl: './validate-miscellaneous-adjustment-sc.component.html',
  styleUrls: ['./validate-miscellaneous-adjustment-sc.component.scss']
})
export class ValidateMiscellaneousAdjustmentScComponent implements OnInit {
  //Local variables
  miscellaneousAdjustmentForm: FormGroup;
  modalRef: BsModalRef;
  canReject: boolean;
  canReturn: boolean;
  isEditApprove: boolean;
  rejectReasonList: Observable<LovList>;
  returnReasonList: Observable<LovList>;
  transactionNumber: number;
  returnHeading: string;
  documents: DocumentItem[];
  comments: TransactionReferenceData[] = [];
  registrationNumber: number;
  establishmentDetails: EstablishmentDetails;
  rejectHeading: string;
  editFlag: boolean;
  referenceNumber: number;
  misscId: number;
  miscellanousDetails: MiscellaneousRequest = new MiscellaneousRequest();
  isReopenClosingInProgress: boolean;
  isPPAEst = false;

  constructor(
    readonly miscellanousAdjustmentService: MiscellaneousAdjustmentService,
    private fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    private lookUpService: LookupService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  ngOnInit(): void {
    scrollToTop();
    this.miscellaneousAdjustmentForm = this.createForm();
    this.getKeysFromTokens();
    this.identifyValidatorActionDetails(this.routerDataToken.assignedRole);
    this.returnReasonList = this.lookUpService.getRegistrationReturnReasonList();
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    if (this.misscId && this.registrationNumber) this.getDataForViews();
    this.getScreenHeader();
  }

  createForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }

  /** Method to read keys from token. */
  getKeysFromTokens() {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.misscId = payload.referenceNo ? Number(payload.id) : null;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyValidatorActionDetails(role: string): void {
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = false;
      this.editFlag = true;
    }
    if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
    }
    if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.canReturn = true;
      this.canReject = true;
    }
  }

  /** Method to get required data to view transaction */
  getDataForViews() {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(response => {
          this.establishmentDetails = response;
          this.isPPAEst = response?.ppaEstablishment;
          this.isReopenClosingInProgress =
            response?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
        }),
        switchMap(() => {
          return this.miscellanousAdjustmentService
            .getValidatorMiscellaneousDetails(this.registrationNumber, this.misscId)
            .pipe(
              tap(response => {
                this.miscellanousDetails = response;
              })
            );
        }),
        switchMap(() => {
          return this.getMiscDocuments();
        }),
        catchError(error => {
          this.alertService.showError(error.error.message);
          this.handleErrors(error);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }
  /** Method to get documents. */
  getMiscDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_ID,
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE,
        this.registrationNumber,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  /** Method to get screen headings */
  getScreenHeader() {
    this.rejectHeading = 'BILLING.REJECT-MISADJUSTMENT-DET';
    this.returnHeading = 'BILLING.RETURN-MISADJUSTMENT-DET';
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.miscellaneousAdjustmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.miscellaneousAdjustmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.miscellaneousAdjustmentForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showPopup(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef);
  }

  /** Method to confirm cancel the transaction */
  confirmCancel() {
    this.decline();
    this.navigateToInboxes();
  }

  /** Method to decline cancel the transaction */
  decline() {
    this.modalRef.hide();
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */
  hidePopup() {
    this.modalRef.hide();
  }

  /** Method to navigate to inbox. */
  navigateToInboxes() {
    this.billingRoutingService.navigateToInbox();
  }

  //Method to approve the transaction.
  confirmApprove() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveMiscWorkflow(workflowData, outcome);
    this.hidePopup();
  }

  // Method to reject the transaction
  confirmReject() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveMiscWorkflow(workflowData, outcome);
    this.hidePopup();
  }

  //Method to return the transaction.
  confirmReturn() {
    const workflowData = this.setWorkFlowDatas(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveMiscWorkflow(workflowData, outcome);
    this.hidePopup();
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.showPopup(templateRef);
  }

  /** Method to set workflow data. */
  setWorkFlowDatas(action: string): BPMUpdateRequest {
    const value: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.miscellaneousAdjustmentForm.get('rejectionReason'))
      value.rejectionReason = this.miscellaneousAdjustmentForm.get('rejectionReason').value;
    if (this.miscellaneousAdjustmentForm.get('comments'))
      value.comments = this.miscellaneousAdjustmentForm.get('comments').value;
    if (this.miscellaneousAdjustmentForm.get('returnReason'))
      value.returnReason = this.miscellaneousAdjustmentForm.get('returnReason').value;
    value.taskId = this.routerDataToken.taskId;
    value.user = this.routerDataToken.assigneeId;
    value.outcome = action;
    return value;
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
  /** Method to save transaction in workflow. */
  saveMiscWorkflow(data: BPMUpdateRequest, outcome) {
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
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest).subscribe(
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
  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.billingRoutingService.navigateToEdit();
  }
}
