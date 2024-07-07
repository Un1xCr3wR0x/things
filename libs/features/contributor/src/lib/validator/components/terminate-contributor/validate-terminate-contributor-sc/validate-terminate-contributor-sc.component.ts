/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
  Role,
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
import { TerminateContributorDetails } from '../../../../shared/models';
import { ContributorService, EstablishmentService, TerminateContributorService } from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-terminate-contributor-sc',
  templateUrl: './validate-terminate-contributor-sc.component.html',
  styleUrls: ['./validate-terminate-contributor-sc.component.scss']
})
export class ValidateTerminateContributorScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  terminationDetails: TerminateContributorDetails;
  disableReturn: boolean = false;
  canRequestInspection: boolean = false;
  hasInspectionCompleted: boolean = false;
  fieldActivityNumber: string;
  terminateHeading: string;
  heading = ContributorConstants.TERMINATE_CONTRIBUTOR_VALIDATOR_HEADING;

  /** Creates an instance of ValidateTerminateContributorScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly terminateContributorService: TerminateContributorService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly inspectionService: InspectionService,
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
    super.getSystemParameters();
    this.checkInspectionRequired(this.routerData.assignedRole);
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.getDataForView();
    if (
      (this.channel === Channel.HRSD || this.channel === Channel.MASAR || this.channel === Channel.AJEER) &&
      (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR)
    ) {
      this.disableReturn = true;
    }
  }

  /** Method to get data for view. */
  getDataForView() {
    super.getBasicDetails(new Map().set('checkBeneficiaryStatus', true)).subscribe(() => {
      this.terminateContributorService
        .getTerminationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
        .subscribe(res => {
          this.terminationDetails = res;
          this.handleTitle(res);
          if (this.terminationDetails?.secondment || this.terminationDetails?.studyLeave) {
            super
              .getDocuments(
                DocumentTransactionId.TERMINATE_CONTRIBUTOR,
                this.terminationDetails?.secondment
                  ? DocumentTransactionType.TERMINATE_SECONDMENT
                  : DocumentTransactionType.TERMINATE_STUDY_LEAVE,
                this.engagementId,
                this.routerData.transactionId
              )
              .subscribe(() => {
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
          } else {
            super
              .getDocuments(
                DocumentTransactionId.TERMINATE_CONTRIBUTOR,
                this.establishment.gccEstablishment
                  ? DocumentTransactionType.TERMINATE_CONTRIBUTOR_IN_GCC
                  : DocumentTransactionType.TERMINATE_CONTRIBUTOR,
                this.engagementId,
                this.routerData.transactionId
              )
              .subscribe(() => {
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
          }
        });
    });
  }
  handleTitle(res: TerminateContributorDetails) {
    if (res?.secondment || res?.studyLeave) {
      this.heading = { english: this.titleEnglish, arabic: this.titleArabic };
    } else {
      this.heading = ContributorConstants.TERMINATE_CONTRIBUTOR_VALIDATOR_HEADING;
    }
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
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

  /** Method to check whether inspection is required. */
  checkInspectionRequired(role: string) {
    this.canRequestInspection =
      role === ValidatorRoles.VALIDATOR_ONE ||
      (role === ValidatorRoles.VALIDATOR && this.channel === Channel.GOSI_ONLINE);
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
              this.routerData,
              'CONTRIBUTOR.SUCCESS-MESSAGES.TERMINATE-INSPECTION-SUCCESS-MESSAGE'
            );
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
