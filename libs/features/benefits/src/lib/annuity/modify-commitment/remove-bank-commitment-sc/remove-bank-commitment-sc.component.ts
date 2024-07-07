/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  BPMUpdateRequest,
  Role,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  WorkFlowActions,
  CoreBenefitService,
  RouterConstantsBase,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BenefitConstants } from '../../../shared/constants';
import {
  BankService,
  BenefitActionsService,
  BenefitDocumentService,
  ManageBenefitService,
  ModifyBenefitService,
  WizardService,
  UiBenefitsService
} from '../../../shared/services';
import { StopSubmitRequest, SubmitRequest } from '../../../shared/models';
import { showErrorMessage } from '../../../shared/utils';
import { CommitmentBaseComponent } from '../../base/commitment-base-component';
import { DocumentDcComponent } from '../../../shared/component';

@Component({
  selector: 'bnt-remove-bank-commitment-sc',
  templateUrl: './remove-bank-commitment-sc.component.html',
  styleUrls: ['./remove-bank-commitment-sc.component.scss']
})
export class RemoveBankCommitmentScComponent extends CommitmentBaseComponent implements OnInit, OnDestroy {
  removeTransactionConstant: string;
  @ViewChild('documentComponent', { static: false })
  readonly documentComponent: DocumentDcComponent;
  /**
   *
   * @param alertService
   * @param modalService
   * @param documentService
   * @param benefitDocumentService
   * @param location
   * @param route
   * @param router
   * @param bankService
   * @param lookUpService
   * @param wizardService
   * @param manageBenefitService
   * @param modifyPensionService
   * @param benefitActionsService
   * @param uuidGeneratorService
   * @param appToken
   * @param language
   * @param routerData
   */
  constructor(
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly location: Location,
    public route: ActivatedRoute,
    readonly router: Router,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly wizardService: WizardService,
    public manageBenefitService: ManageBenefitService,
    public modifyPensionService: ModifyBenefitService,
    public benefitActionsService: BenefitActionsService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreBenefitService: CoreBenefitService,
    readonly uiBenefitsService: UiBenefitsService
  ) {
    super(
      alertService,
      modalService,
      documentService,
      benefitDocumentService,
      location,
      route,
      router,
      bankService,
      lookUpService,
      wizardService,
      manageBenefitService,
      modifyPensionService,
      benefitActionsService,
      uuidGeneratorService,
      authTokenService,
      appToken,
      language,
      routerData,
      coreBenefitService,
      uiBenefitsService
    );
  }
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initialiseView();
    this.transactionId = BenefitConstants.REMOVE_ACCOUNT;
    this.removeTransactionConstant = BenefitConstants.REMOVE_TRANSACTION_CONSTANT;
    // if (!this.isIndividualApp) {
    if (!this.isEditMode) {
      this.getModifyRequiredDocs(this.transactionId, this.doctransactionType);
    } else {
      this.getUploadedDocuments(this.benefitRequestId, this.transactionId, this.doctransactionType);
    }
    // }
  }
  /**
   * Method to submit remove commitment details
   * @param comments
   */
  submitRemoveCommitment(comments) {
    if (this.checkDocumentValidity(this.documentForm)) {
      let submitValues = new StopSubmitRequest();
      if (this.isEditMode) {
        submitValues = {
          comments: comments.comments,
          referenceNo: this.referenceNo,
          uuid: this.documentComponent.uuid
        };
      } else {
        submitValues = {
          comments: comments.comments,
          uuid: this.documentComponent.uuid
        };
      }
      this.benefitActionsService.removeCommitment(this.sin, this.benefitRequestId, submitValues).subscribe(
        res => {
          this.benefitResponse = res;
          if (
            this.isEditMode &&
            (this.role === Role.VALIDATOR_1 ||
              this.role === Role.CUSTOMER_SERVICE_REPRESENTATIVE ||
              this.role === 'Contributor')
          )
            this.saveWorkflowInEdit(comments);
          else {
            this.alertService.clearAlerts();
            this.alertService.showSuccess(this.benefitResponse.message);
            this.coreBenefitService.setBenefitAppliedMessage(this.benefitResponse.message);
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          }
        },
        err => {
          if (err.error.details && err.error.details.length > 0) {
            this.alertService.showError(null, err.error.details);
          } else {
            this.alertService.showError(err.error.message);
          }
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  // confirmRemoveCommitment() {
  //   const submitValues: SubmitRequest = {
  //     commitmentFlow: false,
  //     comments: 'null',
  //     uuid: 'null'
  //   };
  //   this.benefitActionsService.removeCommitment(this.sin, this.benefitRequestId, submitValues).subscribe(
  //     res => {
  //       this.benefitResponse = res;
  //       if (this.isEditMode && this.role === Role.VALIDATOR_1) this.saveWorkflowInEdit('null');
  //       else {
  //         this.alertService.clearAlerts();
  //         this.alertService.showSuccess(this.benefitResponse.message);
  //         this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  //       }
  //     },
  //     err => {
  //       if (err.error.details && err.error.details.length > 0) {
  //         this.alertService.showError(null, err.error.details);
  //       } else {
  //         this.alertService.showError(err.error.message);
  //       }
  //     }
  //   );
  // }
  /**
   * Method to confirm details
   */
  confirm() {
    if (this.sin && this.benefitRequestId && this.referenceNo) {
      this.benefitActionsService.revertRemoveBank(this.sin, this.benefitRequestId, this.referenceNo).subscribe(() => {
        this.modalRef.hide();
        if (!this.isEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
        else this.routeBack();
        this.alertService.clearAlerts();
      });
    } else {
      this.modalRef.hide();
      if (!this.isEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      else this.routeBack();
      this.alertService.clearAlerts();
    }
  }
  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comments) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.comments = comments.comments;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }

  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
  }
}
