/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterData,
  RouterConstantsBase,
  RouterDataToken,
  WizardItem,
  WorkflowService,
  BPMUpdateRequest,
  WorkFlowActions,
  RouterConstants,
  TransactionService,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ViolationsBaseScComponent } from '../../../../shared/components';
import { ViolationConstants } from '../../../../shared/constants';
import { DocumentTransactionType, TransactionChannelEnum, DocumentTransactionId } from '../../../../shared/enums';
import { CancelViolationRequest, CancelViolationResponse, ChangeViolationValidator } from '../../../../shared/models';
import { ViolationsValidatorService } from '../../../../shared/services';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";

@Component({
  selector: 'vol-cancel-violation-sc',
  templateUrl: './cancel-violation-sc.component.html',
  styleUrls: ['./cancel-violation-sc.component.scss']
})
export class CancelViolationScComponent extends ViolationsBaseScComponent implements OnInit {
  /***
   * Local Variables
   */
  cancelDetailsForm: FormGroup = new FormGroup({});
  cancelReasonList$: Observable<LovList>;
  cancelViolationRequest: CancelViolationRequest;
  cancelViolationResponse: CancelViolationResponse;
  cancelViolationWizardItems: WizardItem[] = [];
  currentTab = 0;
  documentList$: Observable<DocumentItem[]>;
  documentList: DocumentItem[];
  modalRef: BsModalRef;
  totalTabs = 1;
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  isComments = false;
  transactionNo = DocumentTransactionId.CANCEL_VIOLATION_ID;

  //ViewChild components
  @ViewChild('cancelViolationWizard', { static: false })
  cancelViolationWizard: ProgressWizardDcComponent;
  violationDetails: ChangeViolationValidator = new ChangeViolationValidator();

  /**
   *
   * @param modalService
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param router
   * @param routerData
   * @param validatorService
   * @param activatedroute
   * @param appToken
   * @param location
   * @param transactionService
   * @param appealVlcService
   * @param authService
   */
  constructor(
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly validatorService: ViolationsValidatorService,
    readonly activatedroute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly transactionService:TransactionService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerData,
      activatedroute,
      appToken,
      location,
      transactionService,
      appealVlcService,
      authService
    );
  }
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initialiseWizard();
    super.initializeData();
    this.cancelReasonList$ = this.lookupService.getCancelViolationsList();
    this.initializeView();
    this.setRoutingParams();
    this.docBusinessTransaction = DocumentTransactionType.CANCEL_TRANSACTION_TYPE;
  }

  /** Method to set flag based on the routing params. */
  setRoutingParams() {
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerData.payload) super.initializeToken();
      this.updateBpmTask.taskId = this.routerData.taskId;
      this.updateBpmTask.user = this.routerData.assigneeId;
      this.isComments = true;
      this.fetchDataForEdit();
      this.cancelViolationWizardItems[0].isActive = true;
      this.cancelViolationWizardItems[0].isDisabled = false;
      this.editMode = true;
      this.transactionTraceId = this.routerData.transactionId;
    }
  }

  /** Method to fetch data for edit on return. */
  fetchDataForEdit() {
    this.validatorService.getValidatorViewDetails(this.violationId, this.referenceNo).subscribe(res => {
      this.violationDetails = res;
    });
  }

  /**
   * Method to initialise wizard component
   */
  initialiseWizard() {
    this.cancelViolationWizardItems = this.getWizard();
    this.cancelViolationWizardItems[0].isDisabled = false;
    this.cancelViolationWizardItems[0].isActive = true;
  }
  /**
   * Method to get wizard items
   */
  getWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ViolationConstants.CANCEL_VIOLATION, 'file-invoice-dollar'));
    wizardItems.push(new WizardItem(ViolationConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /**
   * Method to select wizard items
   * @param index
   */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /**
   * Method to go to previous screen
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    this.cancelViolationWizard.setPreviousItem(this.currentTab);
  }
  /**
   * Method to go to next screen
   */
  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab++;
    if (this.cancelViolationWizard) this.cancelViolationWizard.setNextItem(this.currentTab);
  }

  checkFormValidity() {
    if (this.cancelDetailsForm?.get('cancelViolatonDetailsForm.reason.english')?.valid) {
      this.nextForm();
    } else {
      this.cancelDetailsForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   * Method to save cancelViolationDetails
   */
  saveCancelVolationDetails(cancelValues) {
    this.alertService.clearAlerts();
    if (this.transactionDetails) {
      this.cancelViolationRequest = {
        ...{ channel: this.transactionDetails?.inspectionInfo?.channel?.english },
        ...{ cancelViolationReason: cancelValues?.cancelReason },
        ...{ validatorRole: 'CSR' },
        ...{ transactionTraceId: this.editMode || this.transactionTraceId ? this.transactionTraceId : null },
        ...{ comments: cancelValues?.comments }
      };
    }
    this.alertService.clearAlerts();
    this.validatorService
      .submitCancelViolations(this.violationId, this.cancelViolationRequest)
      .pipe(
        tap(res => {
          this.cancelViolationResponse = res;
          this.transactionTraceId = res.transactionTraceId;
          this.currentTab++;
          this.hasSaved = true;
          if (this.cancelViolationWizard) this.cancelViolationWizard.setNextItem(this.currentTab);
        }),
        switchMap(() => {
          return this.getDocuments(
            DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
            DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
            this.transactionDetails.violationId,
            this.transactionTraceId
          );
        }),
        catchError(err => {
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe();
  }

  /**
   * Method to submit document details
   */
  submitCancelVolations() {
    if (this.checkDocumentValidity(this.cancelDetailsForm)) {
      const comments = this.cancelDetailsForm.get('comments.comments')?.value;
      this.validatorService
        .submitChangeViolation(
          this.violationId,
          this.transactionTraceId,
          comments,
          DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
          this.editMode
        )
        .subscribe(
          res => {
            if (this.editMode) {
              this.updateTaskWorkflows(comments);
            } else {
              this.router.navigate([RouterConstantsBase.ROUTE_VIOLATION_HISTORY(this.regNo)]);
              this.validatorService.alertMessage = res.message;
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }
  updateTaskWorkflows(comment) {
    this.updateBpmTask.comments = comment;
    this.updateBpmTask.outcome = WorkFlowActions.UPDATE;
    this.workflowService.updateTaskWorkflow(this.updateBpmTask).subscribe(
      res => {
        this.alertService.showSuccessByKey(this.getSuccessMessage());
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.rejectViolation(this.currentTab);
  }
}
