/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DocumentService,
  ExchangeRateService,
  RouterDataToken,
  RouterData,
  scrollToTop,
  DocumentItem,
  AlertService,
  LookupService,
  LovList,
  RouterConstants,
  startOfMonth,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  TransactionReferenceData
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BillingRoutingService, EventDateService } from '../../../../shared/services';
import { noop, Observable, throwError } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { EventDate } from '../../../../shared/models';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorRoles } from '../../../../shared/enums';
@Component({
  selector: 'blg-validate-maintain-event-date-sc',
  templateUrl: './validate-maintain-event-date-sc.component.html',
  styleUrls: ['./validate-maintain-event-date-sc.component.scss']
})
export class ValidateMaintainEventDateScComponent implements OnInit {
  //Local variables
  eventDate: Date;
  currentMonthStartDate: Date;
  transactionNumber: number;
  disableApprove = false;
  disableReturn = false;
  monthDifference = 0;
  eventDateValidatorForm: FormGroup;
  showContent = false;
  comments: TransactionReferenceData[] = [];
  eventDateDocumentList: DocumentItem[] = [];
  eventDateInfo: EventDate;
  modalRef: BsModalRef;
  canReturn = true;
  returnApproveFlag = true;
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  referenceNumber: number;
  constructor(
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly eventDateValidatorService: EventDateService,
    readonly alertService: AlertService,
    private lookUpService: LookupService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly exchangeRateService: ExchangeRateService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  /** This method is to initialize the component. */
  ngOnInit(): void {
    scrollToTop();
    this.eventDateValidatorForm = this.createForm();
    if (this.routerDataToken.taskId) {
      this.showContent = true;
      this.initialiseTheView(this.routerDataToken);

      //  if(this.monthDifference>1  )
      this.identifyMaintainEventDateActions(this.routerDataToken.assignedRole);
      this.transactionNumber = this.routerDataToken.transactionId;
    }
    this.returnReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.rejectReasonList = this.lookUpService.getEstablishmentRejectReasonList();
  }

  /** Method to create a form for transaction data. */
  createForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null]
    });
  }

  /** Method to initialse the inbox view. */
  initialiseTheView(validatorDataToken: RouterData) {
    if (validatorDataToken.comments.length > 0) {
      this.comments = validatorDataToken.comments;
    }
    this.bindDataToForm(validatorDataToken);
    this.getDataForView();
  }
  identifyMaintainEventDateActions(value: string): void {
    if (value === ValidatorRoles.COLLECTION_MANAGER) this.canReturn = false;
  }

  /** Method to bind data to the form. */
  bindDataToForm(validatorDataToken: RouterData) {
    this.eventDateValidatorForm.get('taskId').setValue(validatorDataToken.taskId);
    this.eventDateValidatorForm.get('user').setValue(validatorDataToken.assigneeId);
    this.eventDateValidatorForm.get('type').setValue(validatorDataToken.resourceType);
    const payloads = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    this.referenceNumber = payloads.referenceNo ? Number(payloads.referenceNo) : null;
  }

  getDataForView(): void {
    this.eventDateValidatorService
      .getEventDetails()
      .pipe(
        tap(resp => {
          this.eventDateInfo = resp;
          this.currentMonthStartDate = startOfMonth(new Date());
          this.eventDateInfo.eventDateInfo.forEach(data => {
            this.eventDate = data.eventDate.gregorian;
            this.getDocumentsForMaintainEventDate();
            if (new Date(this.eventDate) < new Date(this.currentMonthStartDate)) {
              this.returnApproveFlag = false;
              if (!this.returnApproveFlag) {
                this.alertService.showWarningByKey('BILLING.REJECT-VALIDATION-INFO');
                this.disableApprove = true;
                this.disableReturn = true;
              } else {
                this.disableApprove = false;
                this.disableReturn = false;
              }
            }
          });
        }),
        switchMap(() => {
          return this.getDocumentsForMaintainEventDate();
        }),
        catchError(errs => {
          this.handleError(errs);
          return throwError(errs);
        })
      )
      .subscribe(noop, noop);
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
    this.eventDateValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.eventDateValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /** Method to get documents. */
  getDocumentsForMaintainEventDate(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(BillingConstants.MAINTAIN_EVENT_DATE, BillingConstants.MAINTAIN_EVENT_DATE, 0, this.referenceNumber)
      .pipe(tap(res => (this.eventDateDocumentList = res.filter(item => item.documentContent !== null))));
  }
  /**
   * Method to show return modal.
   * @param templateRef
   */
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.eventDateValidatorForm.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
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
  confirmApprove() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.APPROVE;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.eventDateValidatorForm) {
      if (this.eventDateValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.eventDateValidatorForm.value.comments;
    }
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.APPROVE).subscribe(
      () => {
        this.navigateToInbox(BillingConstants.TRANSACTION_APPROVED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  //Method to reject the transaction.
  confirmReject() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.REJECT;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.eventDateValidatorForm) {
      if (this.eventDateValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.eventDateValidatorForm.value.comments;
      if (this.eventDateValidatorForm.get('rejectionReason'))
        bpmUpdateRequest.rejectionReason = this.eventDateValidatorForm.value.rejectionReason;
    }
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.REJECT).subscribe(
      () => {
        this.alertService.clearAlerts();
        this.navigateToInbox(BillingConstants.TRANSACTION_REJECTED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  //Method to return the transaction.
  confirmReturn() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.RETURN;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (this.eventDateValidatorForm) {
      if (this.eventDateValidatorForm.get('comments'))
        bpmUpdateRequest.comments = this.eventDateValidatorForm.value.comments;
      if (this.eventDateValidatorForm.get('returnReason'))
        bpmUpdateRequest.rejectionReason = this.eventDateValidatorForm.value.returnReason;
    }
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.RETURN).subscribe(
      () => {
        this.navigateToInbox(BillingConstants.TRANSACTION_RETURNED);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  /**
   * Method to navigate on validator actions
   * @param response
   */
  navigateToInbox(message) {
    if (message) {
      this.alertService.showSuccessByKey(message, null, 5);
    }
    this.billingRoutingService.navigateToInbox();
  }

  //Method to confirm cancel the transaction.
  confirmCancel() {
    this.hideModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
    this.alertService.clearAlerts();
  }
}
