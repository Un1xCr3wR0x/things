/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  InspectionReferenceType,
  InspectionService,
  InspectionStatus,
  InspectionTypeEnum,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, noop, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, ValidatorRoles } from '../../../../shared/enums';
import { CancelContributorDetails } from '../../../../shared/models';
import {
  CancelContributorService,
  ContractAuthenticationService,
  ContributorService,
  EstablishmentService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-cancel-contributor-sc',
  templateUrl: './validate-cancel-contributor-sc.component.html',
  styleUrls: ['./validate-cancel-contributor-sc.component.scss']
})
export class ValidateCancelContributorScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables. */
  cancellationDetails: CancelContributorDetails;
  canRequestInspection = false;
  hasInspectionCompleted = false;
  fieldActivityNumber: string;

  /** Creates an instance of ValidateCancelContributorScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly cancelContributorService: CancelContributorService,
    readonly contractService: ContractAuthenticationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly inspectionService: InspectionService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData
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

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    this.checkInspectionRequired(this.routerData.assignedRole);
    super.getSystemParameters();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.initializeView();
  }

  /** Method to check whether inspection is required. */
  checkInspectionRequired(role: string) {
    this.canRequestInspection = role === ValidatorRoles.VALIDATOR_ONE;
  }

  /** Method to initialize validator view. */
  
  initializeView() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .subscribe(() => {
        this.cancelContributorService
          .getCancellationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
          .subscribe(res => {
            this.cancellationDetails = res;
            super.getDocuments(
              DocumentTransactionId.CANCEL_CONTRIBUTOR,
              this.getDocumentTransactionType(),
              this.engagementId,
              this.routerData.transactionId
            ).subscribe(() => {
              if (!this.isPPA) {
                this.checkWhetherInspetionIsCompleted().subscribe(() => {
                  if (this.hasInspectionCompleted) {
                    this.getInspectionDocuments().subscribe(
                      () => {},
                      err => {
                        super.handleError(err, true);
                      }
                    );
                  }
                });
              }
            });
          });
      }, err => {
        super.handleError(err, true);
      });
  }

  /** Method to get document transaction type. */
  getDocumentTransactionType() {
    if (this.establishment?.ppaEstablishment) {
      return this.cancellationDetails?.cancellationReason?.english === 'Wrong Registration'
        ? DocumentTransactionType.CANCEL_PPA_WRONG_REG
        : DocumentTransactionType.CANCEL_CONTRIBUTOR_PPA;
    } else {
      return this.establishment.gccEstablishment
        ? DocumentTransactionType.CANCEL_CONTRIBUTOR_IN_GCC
        : DocumentTransactionType.CANCEL_CONTRIBUTOR;
    }
  }

  /** Method to check whether inspection is completed. */
  checkWhetherInspetionIsCompleted() {
    return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
      filter(res => res && res.length > 0),
      tap(res => {
        this.hasInspectionCompleted = res[0].inspectionTypeInfo.status === InspectionStatus.COMPLETED;
        this.fieldActivityNumber = res[0].fieldActivityNumber;
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
        this.fieldActivityNumber
      )
      .pipe(
        tap(docs => {
          if (docs.length > 0) this.documents = docs.concat(this.documents);
        }),
        catchError(err => {
          super.handleError(err, false);
          return of(this.documents);
        })
      );
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
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
            this.initiateInspection(this.routerData, 'CONTRIBUTOR.SUCCESS-MESSAGES.CANCEL-INSPECTION-SUCCESS-MESSAGE');
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_ENGAGEMENT_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
