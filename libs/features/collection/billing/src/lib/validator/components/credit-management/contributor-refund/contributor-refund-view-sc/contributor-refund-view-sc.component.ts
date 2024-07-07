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
  BilingualText,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  Contributor,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { TerminationTransactionsDetails } from '@gosi-ui/features/collection/billing/lib/shared/models/termination-transactions-details';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../../shared/constants';
import { TransactionOutcome, ValidatorRoles } from '../../../../../shared/enums';
import { EstablishmentDetails } from '../../../../../shared/models';
import {
  BillingRoutingService,
  CreditManagementService,
  EstablishmentService,
  PenalityWavierService
} from '../../../../../shared/services';

@Component({
  selector: 'blg-contributor-refund-view-sc',
  templateUrl: './contributor-refund-view-sc.component.html',
  styleUrls: ['./contributor-refund-view-sc.component.scss']
})
export class ContributorRefundViewScComponent implements OnInit {
  //Local variables
  terminationDetails: TerminationTransactionsDetails;
  validatorFormDet: FormGroup = new FormGroup({});
  contributorRefundForm: FormGroup;
  modalRef: BsModalRef;
  comments: TransactionReferenceData[] = [];
  sin: number;
  establishmentDetails: EstablishmentDetails;
  registrationNumber: number;
  isGOL: boolean;
  documentList: DocumentItem[];
  contributorDetails: Contributor;
  requestNo: number;
  editFlag = false;
  ibanNumber: string;
  transactionNumber: number;
  canReject: boolean;
  canReturn: boolean;
  referenceNumber: number;
  rejectHeadingValue: string;
  returnHeadingValue: string;
  rejectReasons: Observable<LovList>;
  returnReasons: Observable<LovList>;
  activeFlag: boolean;
  personId: number;
  vicBankNameDetail: BilingualText = new BilingualText();
  constructor(
    readonly penalityWavierService: PenalityWavierService,
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    private lookUpService: LookupService,
    readonly establishmentService: EstablishmentService,
    readonly creditManagementService: CreditManagementService,
    readonly billingRoutingService: BillingRoutingService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  /** This method is to initialize the component details. */
  ngOnInit(): void {
    scrollToTop();
    this.contributorRefundForm = this.createContributorRefundForm();
    this.getContributorRefundKeys();
    this.identifyContributorRefundActions(this.routerDataToken.assignedRole);
    this.returnReasons = this.lookUpService.getRegistrationReturnReasonList();
    this.rejectReasons = this.lookUpService.getEstablishmentRejectReasonList();
    this.getBackdatedTerminationValues();
    this.getContributorPersonalDetails();
    this.getContributorRefundScreenHeaders();
    if (this.registrationNumber) this.getData();
  }

  /** Method to read keys from token. */
  getContributorRefundKeys(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.requestNo = payload.requestId ? Number(payload.requestId) : null;
      this.sin = payload.socialInsuranceNo ? Number(payload.socialInsuranceNo) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to identify validator actions. */
  identifyContributorRefundActions(value: string): void {
    if (value === ValidatorRoles.VALIDATOR_ONE) {
      this.canReject = true;
      this.canReturn = false;
      this.editFlag = true;
    }
    if (value === ValidatorRoles.VALIDATOR_TWO) {
      this.canReturn = true;
      this.canReject = true;
      this.editFlag = false;
    }
    if (value === ValidatorRoles.FC_VALIDATOR) {
      this.canReturn = true;
      this.editFlag = false;
    }
  }

  /** Method to get screen heading */
  getContributorRefundScreenHeaders() {
    this.rejectHeadingValue = 'BILLING.REJECT-CONTIBUTOR-REFUND-REQUEST';
    this.returnHeadingValue = 'BILLING.RETURN-CONTIBUTOR-REFUND-REQUEST';
  }
  /** Method to create a form for transaction data. */
  createContributorRefundForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      transactionNo: [null],
      type: [null]
    });
  }
  /** Method to get required data to view transaction details. */
  getData(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishmentDetails = res;
          this.getContributorDet(this.sin);
        }),
        switchMap(() => {
          return this.getContributorRefundDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to get contributor details. */
  getContributorDet(sin: number) {
    this.creditManagementService.getContirbutorDetails(sin).subscribe(
      value => {
        this.activeFlag = value.active;
        this.personId = value.person.personId;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /**----Method to get contributor IBAN details */
  getContributorDetails(iBanCode: string) {
    this.lookUpService.getBankForIban(iBanCode.slice(4, 6)).subscribe(
      res => {
        this.ibanNumber = iBanCode;
        this.vicBankNameDetail = res.items[0]?.value;
      },
      err => this.handleErrors(err)
    );
  }

  /** Method to get documents. */
  getContributorRefundDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE,
        this.sin,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documentList = res.filter(data => data.documentContent !== null))));
  }
  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  approveContributorRefundTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.contributorRefundForm.updateValueAndValidity();
    this.showModals(templateRef);
  }

  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnContributorRefundTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.contributorRefundForm.updateValueAndValidity();
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

  hideModalDetails() {
    this.modalRef.hide();
  }

  //Method to approve the transaction.
  confirmContributorRefundApprove() {
    const workflowData = this.setWorkFlowDataForContributorRefund(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowForContributorRefund(workflowData, outcome);
    this.hideModalDetails();
  }
  /** Method to set workflow data. */
  setWorkFlowDataForContributorRefund(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.contributorRefundForm.get('comments')) data.comments = this.contributorRefundForm.value.comments;
    if (this.contributorRefundForm.get('rejectionReason'))
      data.rejectionReason = this.validatorFormDet.value.rejectionReason;
    if (this.contributorRefundForm.get('returnReason'))
      data.returnReason = this.contributorRefundForm.value.returnReason;
    data.user = this.routerDataToken.assigneeId;
    data.outcome = action;
    data.taskId = this.routerDataToken.taskId;
    return data;
  }
  getRequest(data: BPMUpdateRequest, outcome) {
    const contributorRefundRequest = new BPMUpdateRequest();
    contributorRefundRequest.outcome = outcome;
    contributorRefundRequest.taskId = this.routerDataToken.taskId;
    contributorRefundRequest.user = this.routerDataToken.assigneeId;
    contributorRefundRequest.payload = this.routerDataToken.content;
    contributorRefundRequest.commentScope = 'BPM';
    if (data.rejectionReason) {
      contributorRefundRequest.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_ARB, data.rejectionReason.arabic);
      contributorRefundRequest.updateMap.set(
        BPMMergeUpdateParamEnum.REJECTION_REASON_ENG,
        data.rejectionReason.english
      );
    }
    if (data.returnReason) contributorRefundRequest.returnReason = data.returnReason;
    if (data.comments) contributorRefundRequest.comments = data.comments;
    return contributorRefundRequest;
  }
  /** Method to save transaction in workflow. */
  saveWorkflowForContributorRefund(data: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = this.getRequest(data, outcome);
    if (bpmUpdateRequest.outcome === 'REJECT') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForContributorRefund(data.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 5);
          this.navigateToInbox();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
        () => {
          const successMessage = this.getSuccessMessageForContributorRefund(data.outcome);
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

  /** Method to get success message. */
  getSuccessMessageForContributorRefund(action: string) {
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
  confirmContributorRefundReturn() {
    const workflowData = this.setWorkFlowDataForContributorRefund(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowForContributorRefund(workflowData, outcome);
    this.hideModalDetails();
  }

  //Method to confirm cancel the transaction.
  confirmContributorRefundCancel() {
    this.declineModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  //*@memberof ValidatorScComponent
  declineModal(): void {
    this.modalRef.hide();
  }
  /**
   * Method to show reject modal.
   * @param templateRef
   */
  rejectContributorRefundTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.contributorRefundForm.updateValueAndValidity();
    this.showModals(templateRef);
  }
  //Method to reject the transaction.
  confirmContributorRefundReject() {
    const workflowData = this.setWorkFlowDataForContributorRefund(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowForContributorRefund(workflowData, outcome);
    this.hideModalDetails();
  }

  /** Method to navigate to validator edit. */
  navigateToCsrPage() {
    this.billingRoutingService.navigateToEdit();
  }
  /** Method to get termination details of contributor. */
  getBackdatedTerminationValues() {
    this.creditManagementService
      .getBackdatedTerminationDetails(this.registrationNumber, this.sin, this.requestNo)
      .subscribe(
        value => {
          this.terminationDetails = value;
          this.getContributorDetails(this.terminationDetails.iban);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }
  /** Method to getpersonal details of the contributor. */
  getContributorPersonalDetails() {
    this.creditManagementService.searchContributor(this.registrationNumber, this.sin).subscribe(
      data => {
        this.alertService.clearAllErrorAlerts();
        this.contributorDetails = data;
      },
      err => {
        this.alertService.showError(err.error.message, err.error.details);
      }
    );
  }
}
