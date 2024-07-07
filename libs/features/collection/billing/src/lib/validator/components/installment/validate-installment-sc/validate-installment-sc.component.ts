/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { EstablishmentDetails, InstallmentRequest, InstallmentDetails } from '../../../../shared/models';
import { BillingRoutingService, EstablishmentService, InstallmentService } from '../../../../shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  LovList,
  DocumentService,
  DocumentItem,
  RouterDataToken,
  RouterData,
  TransactionReferenceData,
  LookupService,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  RouterConstants,
  BPMMergeUpdateParamEnum,
  Transaction,
  BilingualText
} from '@gosi-ui/core';
import { noop, Observable, throwError } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TransactionOutcome } from '../../../../shared/enums/transaction-outcome';
import { Router } from '@angular/router';
import { ValidatorRoles } from '../../../../shared/enums';
import { TransactionService } from '@gosi-ui/foundation/transaction-tracing/lib/services';
import { MCITransaction } from '../../../../shared/enums';

@Component({
  selector: 'blg-validate-installment-sc',
  templateUrl: './validate-installment-sc.component.html',
  styleUrls: ['./validate-installment-sc.component.scss']
})
export class ValidateInstallmentScComponent implements OnInit {
  canEdit = true;
  canReject: boolean;
  canReturn: boolean;
  comments: TransactionReferenceData[] = [];
  docTransactionId: string;
  docTransactionType: string;
  documents: DocumentItem[] = [];
  establishmentDetails: EstablishmentDetails = new EstablishmentDetails();
  installmentDetails: InstallmentDetails = new InstallmentDetails();
  installmentDetailsForm: FormGroup;
  installmentNo: number;
  installmentSubmittedDetails: InstallmentRequest = new InstallmentRequest();
  modalRef: BsModalRef;
  outOfMarket = false;
  referenceNumber: number;
  registrationNumber: number;
  installmentRejectList: Observable<LovList>;
  installmentReturnList: Observable<LovList>;
  transactionNumber: number;
  transaction: Transaction[] = [];
  isShow = false;
  isDate: boolean;
  initialDate1: Date;
  initialDate2: Date;
  isGOL: boolean;
  channel: BilingualText;
  isReopenClosingInProgress: boolean;

  /**
   *
   * @param documentService
   * @param installmentService
   * @param routerDataToken
   * @param establishmentService
   * @param billingRoutingService
   * @param modalService
   * @param alertService
   * @param lookUpService
   * @param workflowService
   * @param fb
   * @param router
   */
  constructor(
    readonly billingRoutingService: BillingRoutingService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly installmentService: InstallmentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    private lookUpService: LookupService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly transactionService: TransactionService
  ) {}

  /*
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.installmentDetailsForm = this.createValidateInstallmentForm();
    this.getKeysFromTokens();
    this.getDataForViews();
    this.installmentRejectList = this.lookUpService.getEstablishmentRejectReasonList();
    this.installmentReturnList = this.lookUpService.getRegistrationReturnReasonList();
    this.identifyValidatorActions();
  }
  /** Method to create a form for transaction data. */
  createValidateInstallmentForm() {
    return this.fb.group({
      type: [null],
      taskId: [null],
      user: [null],
      transactionNo: [null]
    });
  }
  /** Method to get required data to view transaction. */
  getDataForViews(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(response => {
          this.establishmentDetails = response;
          this.isReopenClosingInProgress = response.status.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
          this.outOfMarket = this.establishmentDetails.outOfMarket;
        }),
        switchMap(() => {
          return this.installmentService
            .getValidatorInstallmentDetails(this.registrationNumber, this.installmentNo)
            .pipe(
              tap(resp => {
                this.installmentSubmittedDetails = resp;
                this.getDocParameter();
              })
            );
        }),
        switchMap(() => {
          return this.getScannedDocuments();
        }),
        switchMap(() => {
          return this.transactionService.getMCITransactions(this.registrationNumber, MCITransaction.manageOwner).pipe(
            tap(res => {
              this.transaction = res.listOfTransactionDetails;
              res.listOfTransactionDetails.forEach(item => {
                if (
                  item.transactionId === 300313 &&
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
          this.showErrors(error);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }
  getCompareDates() {
    for (let i = 0; i < this.transaction[i].transactionId; i++) {
      if ((this.transaction[i].transactionId = 300313)) {
        this.initialDate1 = new Date(this.transaction[i].initiatedDate?.gregorian.toString());
        this.initialDate2 = new Date(this.installmentSubmittedDetails?.initiatedDate.gregorian.toString());
        this.isDate = this.initialDate1 > this.initialDate2 ? true : false;
        if (this.isDate === true) {
          this.isShow = true;
        }
      }
    }
  }
  /** Method to handle error. */
  showErrors(error) {
    this.alertService.showError(error.error.message);
  }
  /** Method to get document parameters */
  getDocParameter() {
    this.installmentSubmittedDetails.guaranteeDetail.forEach(res => {
      if (res && res.category.english) {
        switch (res.category.english) {
          case 'Bank Guarantee':
            if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_EXCEPTIONAL;
              }
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANK_GUARANTEE;
              }
            }
            break;
          case 'Promissory Note':
            if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_EXCEPTIONAL_CASE;
              }
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_CASE_GOL;
              }
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.PROMISSORY_NOTE;
            }
            break;
          case 'Pension':
            if (this.outOfMarket) {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_REGISTERED_CASE_GOL;
              }
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.PENSION_REGISTERED;
            } else {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_CLOSED_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PENSION_CLOSED;
              }
            }
            break;
          case 'Other':
            if (!this.outOfMarket && res.type.english === 'No Guarantee') {
              if (this.installmentSubmittedDetails?.installmentPeriodInMonths > 30) {
                if (this.channel.english === 'GOL') {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL_CASE_GOL;
                } else {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_EXCEPTIONAL;
                }
              } else {
                if (this.channel.english == 'GOL') {
                  this.docTransactionId = BillingConstants.INSTALLMENT;
                  this.docTransactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE_CASE_GOL;
                }
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE;
              }
            } else if (this.outOfMarket && res.type.english === 'Establishment owner is on a job') {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB_GOL;
              } else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.ESTABLISHMENT_OWNER_ON_JOB;
              }
            } else if (this.outOfMarket && !this.isGOL) {
              this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST;
            } else if (this.outOfMarket && res.type.english === 'Deceased / no source of income') {
              if (this.channel.english === 'GOL') {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST_GOL;
              }
               else {
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.DECEASED_CLOSED_EST;
               }
            } 
            // else if (!this.isGOL && this.outOfMarket && res.type.english === 'Deceased / no source of income' ) {
            //     this.docTransactionId = BillingConstants.INSTALLMENT;
            //     this.docTransactionType = BillingConstants.NON_COMPLIANCE_GUARANTEE;
                
            // } 
            else if (res.type.english === 'Special Request'){          
              if (this.installmentSubmittedDetails?.specialGuaranteeType?.english === 'Bank Guarantee'){
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.BANKGUARANTEE_SPECIAL_REQUEST;
              } else if (this.installmentSubmittedDetails?.specialGuaranteeType?.english === 'Promissory Note'){
                this.docTransactionId = BillingConstants.INSTALLMENT;
                this.docTransactionType = BillingConstants.PROMISSORY_NOTE_SPECIAL_REQUEST;
                }
             else{ this.docTransactionId = BillingConstants.INSTALLMENT;
              this.docTransactionType = BillingConstants.SPECIAL_REQUEST;
             }
            }
            break;
        }
      }
    });
  }
  /*
   * Method to identify validator actions
   */
  identifyValidatorActions() {
    if (this.routerDataToken && this.routerDataToken.payload) {
      const payload = JSON.parse(this.routerDataToken.payload);
      switch (payload.assignedRole) {
        case ValidatorRoles.VALIDATOR_ONE:
          this.canReject = true;
          this.canReturn = false;

          if (this.isGOL) {
            this.canReturn = true;
            this.canEdit = false;
          }

          break;
        case ValidatorRoles.VALIDATOR_TWO:
          this.canReturn = true;
          this.canReject = true;
          this.canEdit = false;
          break;
        case 'FC Approver':
          this.canReturn = true;
          this.canEdit = false;
          break;
        case ValidatorRoles.CDM:
          this.canReturn = true;
          break;
        case ValidatorRoles.GDIC:
          this.canReturn = true;
          this.canEdit = true;
          break;
      }
    }
  }

  /** Method to navigate to edit screen */
  navigateToEdit() {
    this.billingRoutingService.navigateToEdit();
  }

  /** Method to read keys from token. */
  getKeysFromTokens(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
      this.installmentNo = payload.installmentId;
      this.channel = payload.channel;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
    }
    if (this.routerDataToken.comments.length > 0) this.comments = this.routerDataToken.comments;
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  /** Method to get documents. */
  getScannedDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(this.docTransactionId, this.docTransactionType, this.registrationNumber, this.referenceNumber)
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.installmentDetailsForm.updateValueAndValidity();
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /**
   * This method is to show the cancel modal reference.
   * @param modalRef
   */
  showCancelModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  //Method to approve the transaction.
  approveInstallmentDetails() {
    const approveflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.APPROVE);
    const outcome = WorkFlowActions.APPROVE;
    this.saveWorkflowForCreditTransfer(approveflowData, outcome);
    this.hideModal();
  }

  //Method to reject the transaction.
  rejectInstallmentDetails() {
    const rejectflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.REJECT);
    const outcome = WorkFlowActions.REJECT;
    this.saveWorkflowForCreditTransfer(rejectflowData, outcome);
    this.hideModal();
  }

  //Method to return the transaction.
  returnInstallmentDetails() {
    const returnflowData = this.setWorkFlowDataForCreditTransfer(TransactionOutcome.RETURN);
    const outcome = WorkFlowActions.RETURN;
    this.saveWorkflowForCreditTransfer(returnflowData, outcome);
    this.hideModal();
  }
  /** Method to set workflow data. */
  setWorkFlowDataForCreditTransfer(action: string): BPMUpdateRequest {
    const bpmdata: BPMUpdateRequest = new BPMUpdateRequest();
    if (this.installmentDetailsForm) {
      if (this.installmentDetailsForm.get('rejectionReason'))
        bpmdata.rejectionReason = this.installmentDetailsForm.get('rejectionReason').value;
      if (this.installmentDetailsForm.get('comments'))
        bpmdata.comments = this.installmentDetailsForm.get('comments').value;
      if (this.installmentDetailsForm.get('returnReason'))
        bpmdata.returnReason = this.installmentDetailsForm.get('returnReason').value;
    }
    bpmdata.outcome = action;
    bpmdata.user = this.routerDataToken.assigneeId;
    bpmdata.taskId = this.routerDataToken.taskId;
    return bpmdata;
  }
  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModal() {
    this.modalRef.hide();
  }
  /**
   * This method is to confirm installment details
   */
  confirmInstallmentDetails() {
    this.hideModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is to hide the modal reference.
   */
  /** Method to save transaction in workflow. */
  saveWorkflowForCreditTransfer(bpmrequest: BPMUpdateRequest, outcome) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = outcome;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.payload = this.routerDataToken.content;
    this.transactionNumber = this.routerDataToken.transactionId;
    if (bpmrequest.rejectionReason) {
      bpmUpdateRequest.updateMap.set(
        BPMMergeUpdateParamEnum.INSTALLMENT_REJECTION_REASON_ARB,
        bpmrequest.rejectionReason.arabic
      );
      bpmUpdateRequest.updateMap.set(
        BPMMergeUpdateParamEnum.INSTALLMENT_REJECTION_REASON_ENG,
        bpmrequest.rejectionReason.english
      );
    }
    if (bpmrequest.comments) bpmUpdateRequest.comments = bpmrequest.comments;
    if (bpmrequest.returnReason) {
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ARB, bpmrequest.returnReason.arabic);
      bpmUpdateRequest.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_ENG, bpmrequest.returnReason.english);
    }
    if (bpmUpdateRequest.outcome === 'REJECT' || bpmUpdateRequest.outcome === 'RETURN') {
      this.workflowService.mergeAndUpdateTask(bpmUpdateRequest).subscribe(
        () => {
          const successMessage = this.getInstallmentSuccessMessage(bpmrequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 10);
          this.navigateToInbox();
        },
        err => this.alertService.showError(err.error.message)
      );
    } else {
      this.workflowService.updateTaskWorkflow(bpmUpdateRequest, outcome).subscribe(
        () => {
          const successMessage = this.getInstallmentSuccessMessage(bpmrequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 10);
          this.navigateToInbox();
        },
        err => this.alertService.showError(err.error.message)
      );
    }
  }
  /** Method to navigate to inbox. */
  navigateToInbox() {
    this.billingRoutingService.navigateToInbox();
  }
  /** Method to get success messages. */
  getInstallmentSuccessMessage(actions: string) {
    let value: string;
    switch (actions) {
      case TransactionOutcome.REJECT:
        value = BillingConstants.TRANSACTION_REJECTED;
        break;
      case TransactionOutcome.APPROVE:
        value = BillingConstants.TRANSACTION_APPROVED;
        break;
      case TransactionOutcome.RETURN:
        value = BillingConstants.TRANSACTION_RETURNED;
        break;
    }
    return value;
  }
}
