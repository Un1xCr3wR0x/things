/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  LovList,
  LookupService,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService,
  WorkFlowActions,
  RouterConstants,
  TransactionService,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ViolationsBaseScComponent } from '../../../../shared/components';
import {
  ChangeViolationValidator,
  ModifyContributor,
  ModifyViolationRequest,
  ModifyViolationResponse
} from '../../../../shared/models';
import {
  TransactionChannelEnum,
  ViolationsWizardTypes,
  DocumentTransactionType,
  DocumentTransactionId
} from '../../../../shared/enums';
import { ViolationsValidatorService } from '../../../../shared/services';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";

@Component({
  selector: 'vol-modify-penalty-amount-sc',
  templateUrl: './modify-penalty-amount-sc.component.html',
  styleUrls: ['./modify-penalty-amount-sc.component.scss']
})
export class ModifyPenaltyAmountScComponent extends ViolationsBaseScComponent implements OnInit {
  activeTab = 0;
  modalRef: BsModalRef;
  totalTabs = 1;
  modifywizardItems: WizardItem[] = [];
  documentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;
  hasInitialised: boolean;
  modifyViolationResponse: ModifyViolationResponse;
  initialModifyAmount = 0;
  modifyDetailsForm: FormGroup = new FormGroup({});
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  isComments = false;
  violationDetails: ChangeViolationValidator = new ChangeViolationValidator();
  transactionNo = DocumentTransactionId.MODIFY_VIOLATION_ID;

  //ViewChild components
  @ViewChild('modifycontractWizard', { static: false })
  modifycontractWizard: ProgressWizardDcComponent;
  modifyViolationRequest: ModifyViolationRequest;
  modifyReasonList$: Observable<LovList>;

  /**
   *
   * @param modalService
   * @param lookupService
   * @param router
   * @param workflowService
   * @param documentService
   * @param alertService
   * @param routerData
   * @param validatorService
   * @param activatedroute
   * @param appToken
   */
  constructor(
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
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

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializeWizard();
    this.initializeData();
    this.modifyReasonList$ = this.lookupService.getModifyViolationsList();
    super.initializeView();
    this.setRouteParams();
    this.docBusinessTransaction = DocumentTransactionType.MODIFY_VIOLATION_TYPE;
  }

  /** Method to set  flag based on the route params. */
  setRouteParams() {
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerData.payload) super.initializeToken();
      this.updateBpmTask.taskId = this.routerData.taskId;
      this.updateBpmTask.user = this.routerData.assigneeId;
      this.isComments = true;
      this.getDataForEdit();
      this.modifywizardItems[0].isActive = true;
      this.modifywizardItems[0].isDisabled = false;
      this.transactionTraceId = this.routerData.transactionId;
      this.editMode = true;
    }
  }

  /** Method to fetch data for edit on return. */
  getDataForEdit() {
    this.validatorService.getValidatorViewDetails(this.violationId, this.referenceNo).subscribe(res => {
      this.violationDetails = res;
    });
  }

  /** Method to initialize wizard. */
  initializeWizard() {
    this.modifywizardItems = this.getWizardItems();
    this.modifywizardItems[0].isActive = true;
    this.modifywizardItems[0].isDisabled = false;
  }

  /** Method to get wizard items. */
  getWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ViolationsWizardTypes.VIOLATION_DETAILS, 'file-invoice-dollar'));
    wizardItems.push(new WizardItem(ViolationsWizardTypes.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectModifyWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = wizardIndex;
  }

  /**
   * This method is to navigate to previous tab
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.activeTab--;
    this.modifycontractWizard.setPreviousItem(this.activeTab);
  }

  submitModifyPenalty() {
    if (this.checkDocumentValidity(this.modifyDetailsForm)) {
      const comments = this.modifyDetailsForm?.get('comments.comments')?.value;
      this.validatorService
        .submitChangeViolation(
          this.violationId,
          this.transactionTraceId,
          comments,
          DocumentTransactionType.MODIFY_TRANSACTION_TYPE,
          this.editMode
        )
        .subscribe(
          res => {
            if (this.editMode) {
              this.updateTaskWorkflow(comments);
            } else {
              this.router.navigate([RouterConstantsBase.ROUTE_VIOLATION_HISTORY(this.regNo)]);
              this.validatorService.alertMessage = res.message;
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }

  updateTaskWorkflow(comments) {
    this.updateBpmTask.outcome = WorkFlowActions.UPDATE;
    this.updateBpmTask.comments = comments;
    this.workflowService.updateTaskWorkflow(this.updateBpmTask).subscribe(
      () => {
        this.alertService.showSuccessByKey(this.getSuccessMessage());
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  /**
   * This method is to navigate to previous tab
   */
  submitModifiedPenaltyDetails(modifiedValues) {
    this.alertService.clearAlerts();
    if (this.transactionDetails) {
      this.modifyViolationRequest = {
        ...{ channel: this.transactionDetails?.inspectionInfo?.channel?.english },
        ...{ reasonForModification: modifiedValues?.reason },
        ...{ totalCurrentPenaltyAmount: this.transactionDetails.penaltyAmount },
        ...{ totalNewPenaltyAmount: modifiedValues.amount },
        ...{ initiatorRole: 'CSR' },
        ...{ violationId: this.violationId },
        ...{ transactionTraceId: this.editMode || this.transactionTraceId ? this.transactionTraceId : null },
        ...{ comments: modifiedValues?.comments }
      };
      if (this.transactionDetails && this.transactionDetails.isSimisViolation === false) {
        this.modifyViolationRequest.contributors = new Array<ModifyContributor>();
        this.transactionDetails?.contributors.forEach((contributor, i) => {
          const modifiedContributor = {
            contributorId: contributor.contributorId,
            currentPenaltyAmount: contributor.penaltyAmount,
            excluded: contributor.excluded,
            newPenaltyAmount: contributor.excluded ? this.initialModifyAmount : contributor.newPenaltyAmount,
            vlContributorId: contributor.vlContributorId
          };
          this.modifyViolationRequest?.contributors.push(modifiedContributor);
        });
      }
    }
    this.alertService.clearAlerts();
    this.validatorService
      .submitModifyViolations(this.violationId, this.modifyViolationRequest)
      .pipe(
        tap(res => {
          this.modifyViolationResponse = res;
          this.transactionTraceId = res.transactionTraceId;
          this.activeTab++;
          this.hasSaved = true;
          if (this.modifycontractWizard) this.modifycontractWizard.setNextItem(this.activeTab);
        }),
        switchMap(() => {
          return this.getDocuments(
            DocumentTransactionType.MODIFY_VIOLATION_TYPE,
            DocumentTransactionType.MODIFY_VIOLATION_TYPE,
            this.violationId,
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
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.rejectViolation(this.activeTab);
  }
  /**
   * This method is to decline cancelation the form   *
   */
  decline() {
    this.modalRef.hide();
  }
}
