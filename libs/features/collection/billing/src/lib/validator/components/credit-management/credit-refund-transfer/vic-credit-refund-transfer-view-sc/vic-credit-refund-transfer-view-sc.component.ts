/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  BilingualText,
  Role,
  BPMMergeUpdateParamEnum,
  SamaVerificationStatus
} from '@gosi-ui/core';
import {
  CreditBalanceDetails,
  CreditRefundDetails,
  VicCreditRefundIbanDetails,
  VicContributorDetails
} from '../../../../../shared/models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BillingRoutingService, PenalityWavierService, CreditManagementService } from '../../../../../shared/services';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, Observable, noop } from 'rxjs';
import { TransactionOutcome } from '../../../../../shared/enums';
import { Router } from '@angular/router';
import { BillingConstants } from '../../../../../shared/constants';
import { ValidatorRoles } from '../../../../../shared/enums';

@Component({
  selector: 'blg-vic-credit-refund-transfer-view-sc',
  templateUrl: './vic-credit-refund-transfer-view-sc.component.html',
  styleUrls: ['./vic-credit-refund-transfer-view-sc.component.scss']
})
export class VicCreditRefundTransferViewScComponent implements OnInit {
  //Local variables
  personid: number;
  editFlag: boolean;
  documents: DocumentItem[];
  requestNo: number;
  vicCreditBalanceDetails: CreditRefundDetails;
  bankName: BilingualText;
  transactionNumber: number;
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  canReject: boolean;
  rejectReasonLists: Observable<LovList>;
  returnReasonLists: Observable<LovList>;
  vicValidatorForm: FormGroup = new FormGroup({});
  comments: TransactionReferenceData[] = [];
  vicCreditManagementForm: FormGroup;
  modalRef: BsModalRef;
  canReturn: boolean;
  referenceNumber: number;
  rejectHeadingVic: string;
  returnHeadingVic: string;
  sin: number;
  isGOL: boolean;
  vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;
  vicAccountDetails: CreditBalanceDetails;
  iscreditRefund = false;
  initiatorRoleId: string;
  isSamaWorkflow = false;
  isSamaFailed: boolean;
  isSamaFail: boolean;

  constructor(
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly alertService: AlertService,
    readonly billingRoutingService: BillingRoutingService,
    readonly creditManagementService: CreditManagementService,
    readonly router: Router,
    readonly modalService: BsModalService,
    private lookUpService: LookupService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.vicCreditManagementForm = this.createVicCreditForm();
    this.getVicCreditKeys();
    if (this.routerDataToken) {
      if (this.routerDataToken.initiatorRoleId === Role.CUSTOMER_SERVICE_SUPERVISOR) this.iscreditRefund = true;
    }
    this.identifyVicCreditValidatorActions(this.routerDataToken.assignedRole);
    this.returnReasonLists = this.lookUpService.getRegistrationReturnReasonList();
    this.rejectReasonLists = this.lookUpService.getEstablishmentRejectReasonList();
    if (this.sin) this.getDataForVicRefundView();
    // this.getAllVicCreditDetails(this.sin, this.requestNo);
    this.getVicCreditScreenHeaders();
  }

  /** Method to read keys from token. */
  getVicCreditKeys(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.requestNo = payload.requestId ? Number(payload.requestId) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.sin = payload.socialInsuranceNo ? Number(payload.socialInsuranceNo) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyVicCreditValidatorActions(role: string): void {
    if (role === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
    }
    if (role === ValidatorRoles.VALIDATOR_TWO) {
      this.canReturn = true;
      this.canReject = true;
    }
    if (role === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = false;
      this.editFlag = true;
    }
  }

  /** Method to get screen headings for vic refund vlidator view*/
  getVicCreditScreenHeaders() {
    this.rejectHeadingVic = 'BILLING.REJECT-CREDIT-REFUND-BALANCE';
    this.returnHeadingVic = 'BILLING.RETURN-CREDIT-REFUND-BALANCE';
  }
  /** Method to create a form for transaction data. */
  createVicCreditForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }
  /** Method to get required data to view transaction. */
  getDataForVicRefundView(): void {
    this.creditManagementService
      .getContirbutorDetails(this.sin)
      .pipe(
        tap(res => {
          this.contributorDetails = res;
          this.getContributorDetails(res?.person?.personId);
          this.getVicCreditRefundAmount(this.sin, this.requestNo);
        }),
        switchMap(() => {
          return this.getVicDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleErrorForVic(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getContributorDetails(personId: number) {
    this.creditManagementService.getVicContirbutorIbanDetails(personId).subscribe(
      ibanDetails => {
        if (ibanDetails.bankAccountList && ibanDetails.bankAccountList[0]) {
          if (ibanDetails?.bankAccountList[0]?.verificationStatus === SamaVerificationStatus.PENDING)
            this.isSamaWorkflow = true;
          if (ibanDetails?.bankAccountList[0]?.verificationStatus === SamaVerificationStatus.SAMA_VERIFICATION_FAILED)
            this.isSamaFailed = true;
        }
      },
      errs => this.alertService.showError(errs.error.message)
    );
  }
  /** Method to get credit refunded amount. */
  getVicCreditRefundAmount(sin: number, requestNo: number) {
    this.creditManagementService.getVicCreditRefundAmountDetails(sin, requestNo).subscribe(
      val => {
        this.vicCreditBalanceDetails = val;
        this.getVicIbanDetails(this.vicCreditBalanceDetails?.iban);
        if (val?.paymentMode?.english == 'Cheque') {
          this.isSamaFail = false;
        } else this.isSamaFail = true;
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }
  /**----Method to get contributor IBAN details */
  getVicIbanDetails(iBanCode: string) {
    this.lookUpService.getBankForIban(iBanCode?.slice(4, 6)).subscribe(
      res => {
        this.bankName = res.items[0]?.value;
      },
      err => this.handleErrorForVic(err)
    );
  }
  /** Method to get documents. */
  getVicDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
        this.sin,
        this.referenceNumber
      )
      .pipe(tap(resp => (this.documents = resp.filter(items => items.documentContent !== null))));
  }
  /** Method to handle error. */
  handleErrorForVic(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveVicRefundCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.vicCreditManagementForm.updateValueAndValidity();
    this.showModalsForVicRefund(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnVicRefundCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.vicCreditManagementForm.updateValueAndValidity();
    this.showModalsForVicRefund(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModalsForVicRefund(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModals() {
    this.modalRef.hide();
  }

  //Method to approve the transaction.
  confirmVicRefundCreditApprove() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowForCredit(workflowData, outcome);
    this.hideModals();
  }
  /** Method to set workflow data for vic credit refund. */
  setWorkFlowDataForCredit(action: string): BPMUpdateRequest {
    const val: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.vicCreditManagementForm.get('comments')) val.comments = this.vicCreditManagementForm.get('comments').value;
    if (this.vicCreditManagementForm.get('rejectionReason')) {
      val.rejectionReason = this.vicCreditManagementForm.get('rejectionReason').value;
      val.rejectionReason.arabic = `${val.rejectionReason.arabic}(${val.comments})`;
      val.rejectionReason.english = `${val.rejectionReason.english}(${val.comments})`;
    }
    if (this.vicCreditManagementForm.get('returnReason'))
      val.returnReason = this.vicCreditManagementForm.get('returnReason').value;
    val.outcome = action;
    val.taskId = this.routerDataToken.taskId;
    val.user = this.routerDataToken.assigneeId;
    return val;
  }
  /** Method to save transaction in workflow for vic credit refund. */
  saveWorkflowForCredit(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.commentScope = 'BPM';
    bpmUpdateRequest.payload = this.routerDataToken.content;
    if (data.rejectionReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ENG, data.rejectionReason.english);
    }
    if (data.comments) bpmUpdateRequest.comments = data.comments;
    if (data.returnReason) bpmUpdateRequest.returnReason = data.returnReason;
    if (bpmUpdateRequest.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          const successMessageForVic = this.getSuccessMessageForVicRefundCredit(data.outcome);
          this.alertService.showSuccessByKey(successMessageForVic, null, 5);
          this.navigateBackToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
        () => {
          const successMessageForVic = this.getSuccessMessageForVicRefundCredit(data.outcome);
          this.alertService.showSuccessByKey(successMessageForVic, null, 5);
          this.navigateBackToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /** Method to navigate to inbox. */
  navigateBackToInbox() {
    this.billingRoutingService.navigateToInbox();
  }

  /** Method to get success message. */
  getSuccessMessageForVicRefundCredit(data: string) {
    let msg: string;
    switch (data) {
      case TransactionOutcome.APPROVE:
        msg = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.RETURN:
        msg = BillingConstants.TRANSACTION_RETURNED;
        break;
      case TransactionOutcome.REJECT:
        msg = BillingConstants.TRANSACTION_REJECTED;
        break;
    }
    return msg;
  }
  //Method to return the transaction.
  confirmVicRefundCreditReturn() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowForCredit(workflowData, outcome);
    this.hideModals();
  }

  //Method to confirm cancel the transaction.
  confirmVicRefundCreditCancel() {
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
  rejectVicRefundCreditTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.vicCreditManagementForm.updateValueAndValidity();
    this.showModalsForVicRefund(templateRef);
  }
  //Method to reject the transaction.
  confirmVicRefundCreditReject() {
    const workflowData = this.setWorkFlowDataForCredit(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowForCredit(workflowData, outcome);
    this.hideModals();
  }

  /** Method to navigate to validator edit. */
  navigateToEditForVicREfund() {
    this.billingRoutingService.navigateToEdit();
  }
}
