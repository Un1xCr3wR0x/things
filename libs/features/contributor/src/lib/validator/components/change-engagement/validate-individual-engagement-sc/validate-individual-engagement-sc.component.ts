/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  Channel,
  DocumentService,
  InspectionReferenceType,
  InspectionService,
  InspectionStatus,
  InspectionTypeEnum,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, ValidatorRoles, YesOrNo } from '../../../../shared/enums';
import { ContributorBPMRequest, UpdatedWageDetails } from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-individual-engagement-sc',
  templateUrl: './validate-individual-engagement-sc.component.html',
  styleUrls: ['./validate-individual-engagement-sc.component.scss']
})
export class ValidateIndividualEngagementScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  engagement: UpdatedWageDetails;
  transactionTypes: string[] = [];
  canEditPenalty = false;
  canRequestInspection = false;
  hasInspectionCompleted = false;
  fieldActivityNo: string;
  engagementDetails;

  /** Observables */
  yesOrNoList: Observable<LovList>;
  disableIconReopen: boolean = false;

  /**
   * Creates an instance of ValidateIndividualEngagementScComponent
   * @param routerDataToken token
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly inspectionService: InspectionService,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly engagementService: EngagementService,
    readonly contractService: ContractAuthenticationService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  /**Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerDataToken);
    super.setFlagsForView(this.routerDataToken);
    this.checkInspectionRequired(this.routerDataToken.assignedRole);
    this.getDataForView();
    super.getDefaultLookupValues();
    this.getLookupValues();
    super.getSystemParameters();
  }

  /** Method to check whether inspection is required. */
  checkInspectionRequired(role: string) {
    this.canRequestInspection =
      (role === ValidatorRoles.VALIDATOR_ONE ||
        (role === ValidatorRoles.VALIDATOR && this.channel === Channel.GOSI_ONLINE)) &&
      !this.rasedWageUpdate;
  }

  /** Method to get lookup values for component. */
  getLookupValues() {
    this.yesOrNoList = this.lookupService.getYesOrNoList();
  }

  /** Method to retrieve data for validator view. */

  getDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      super.getBasicDetails(new Map().set('checkBeneficiaryStatus', true)).subscribe(
        () => {
          let serviceCall;
          if (!this.isModifyCoverage) {
            serviceCall = this.manageWageService.getEngagementInWorkflow(
              this.registrationNo,
              this.socialInsuranceNo,
              this.engagementId,
              this.referenceNo
            );
          } else {
            serviceCall = this.manageWageService.getModifyCoverageDetails(
              this.registrationNo,
              this.socialInsuranceNo,
              this.engagementId,
              this.referenceNo
            );
          }
          if (!this.isPPA) {
            this.validatorForm.addControl(
              'penalty',
              this.fb.group({
                english: [YesOrNo.YES, { validators: Validators.required }],
                arabic: null
              })
            );
          } else {
            this.validatorForm.addControl(
              'penalty',
              this.fb.group({
                english: [YesOrNo.NO, { validators: null }],
                arabic: null
              })
            );
          }
          // if (this.channel === Channel.TAMINATY && this.isPPA) this.canReject = true;

          serviceCall.subscribe(res => {
            this.transactionTypes = this.establishment.gccEstablishment
              ? [DocumentTransactionType.CHANGE_ENGAGEMENT_IN_GCC]
              : res.docFetchTypes;
            this.engagement = res;
            this.checkPenaltyIndicator();
            if (this.isPPA) {
              this.getAllDocuments(this.routerDataToken.transactionId).subscribe(() => {
                this.documents = this.documents;
              });
            } else {
              super
                .getDocuments(
                  !this.isModifyCoverage
                    ? DocumentTransactionId.CHANGE_ENGAGEMENT
                    : DocumentTransactionId.MAINTAIN_COVERAGE,
                  this.transactionTypes,
                  this.engagementId,
                  this.routerDataToken.transactionId
                )
                .subscribe(docs => {
                  this.documents = docs || [];
                  if (!this.isPPA) {
                    this.checkInspectionStatus().subscribe(() => {
                      if (this.hasInspectionCompleted) {
                        this.getInspectionDocuments().subscribe(
                          () => {},
                          err => {
                            super.handleError(err, false);
                          }
                        );
                      }
                    });
                  }
                });
            }
          });
        },
        err => {
          super.handleError(err, false);
        }
      );
    }
  }

  /** Method to enable,disable and set set penalty indicator. */
  checkPenaltyIndicator() {
    if (
      this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR ||
      this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR_ONE
    )
      this.canEditPenalty = true;
    this.setPenaltyIndicator();
  }

  /** Method to check inspection completion status. */
  checkInspectionStatus() {
    return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
      filter(res => res && res.length > 0),
      tap(res => {
        this.hasInspectionCompleted = res[0].inspectionTypeInfo.status === InspectionStatus.COMPLETED;
        this.fieldActivityNo = res[0].fieldActivityNumber;
      })
    );
  }

  /** Method to get Inspection documents. */
  getInspectionDocuments() {
    return this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.socialInsuranceNo,
        InspectionReferenceType.CONTRIBUTOR,
        this.fieldActivityNo
      )
      .pipe(
        tap(res => {
          if (res.length > 0) this.documents = res.concat(this.documents);
        }),
        catchError(error => {
          super.handleError(error, false);
          return of(this.documents);
        })
      );
  }

  /**Method to  set penalty indicator*/
  setPenaltyIndicator() {
    if (this.engagement.penaltyIndicator !== null && this.engagement.penaltyIndicator !== undefined) {
      if (this.engagement.penaltyIndicator === 1) this.validatorForm.get('penalty.english').setValue(YesOrNo.YES);
      else this.validatorForm.get('penalty.english').setValue(YesOrNo.NO);
    }
  }
  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    let action = super.getWorkflowAction(key);
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    if (action === WorkFlowActions.APPROVE && this.isPPA && approveWithDocs) {
      action = WorkFlowActions.APPROVE_WITH_DOCS;
    }
    const data = super.setWorkflowData(this.routerDataToken, action);
    this.savePenaltyIndicator(data);
    super.hideModal();
  }

  /** Method to dave penalty. */
  savePenaltyIndicator(payload: ContributorBPMRequest) {
    this.engagementService
      .updatePenaltyIndicator(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.isPPA ? 0 : this.validatorForm.get('penalty.english').value === YesOrNo.YES ? 1 : 0
      )
      .subscribe(
        () => super.saveWorkflow(payload),
        err => this.handleError(err, false)
      );
  }

  /** Method to check for  active inspection. */
  checkForActiveInspection() {
    this.inspectionService
      .getInspectionList(this.registrationNo, this.socialInsuranceNo, true)
      .pipe(
        tap(res => {
          if (res.length > 0)
            this.alertService.showErrorByKey(ContributorConstants.VALIDATOR_CANNOT_SEND_FOR_INSPECTION, {
              personFullName: this.getPersonName(),
              transactionId: Number(res[0].transactionTraceId)
            });
          else
            this.initiateInspection(
              this.routerDataToken,
              !this.isModifyCoverage
                ? 'CONTRIBUTOR.SUCCESS-MESSAGES.CHANGE-ENGAGEMENT-INSPECTION-SUCCESS-MESSAGE'
                : 'CONTRIBUTOR.SUCCESS-MESSAGES.MODIFY-COVERAGE-INSPECTION-SUCCESS-MESSAGE'
            );
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
  }

  //Method to navigate to edit mode.
  navigateToEdit() {
    this.routerDataToken.tabIndicator = 1;
    if (!this.establishment.ppaEstablishment) {
      this.contributorService.setPenaltyIndicator =
        this.validatorForm.get('penalty.english').value === YesOrNo.YES ? 1 : 0;
    } else {
      this.contributorService.setPenaltyIndicator = 0;
    }
    this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_EDIT]);
  }

  /** Method to navigate to scan document section. */
  navigateToScan() {
    this.routerDataToken.tabIndicator = 2;
    this.routerDataToken.documentFetchTypes = this.transactionTypes;
    this.contributorService.setPenaltyIndicator =
      this.validatorForm.get('penalty.english').value === YesOrNo.YES ? 1 : 0;
    this.router.navigate([ContributorRouteConstants.ROUTE_CHANGE_ENGAGEMENT_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
