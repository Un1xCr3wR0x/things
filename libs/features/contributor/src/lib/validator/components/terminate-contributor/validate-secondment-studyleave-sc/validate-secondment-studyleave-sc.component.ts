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
  LookupService,
  Role,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { ContributorTypesEnum, DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { EngagementDetails, TerminateContributorDetails } from '../../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  TerminateContributorService
} from '../../../../shared/services';
import { TerminationReason } from '@gosi-ui/features/contributor/lib/shared/enums/termination-reason';

@Component({
  selector: 'cnt-validate-secondment-studyleave-sc',
  templateUrl: './validate-secondment-studyleave-sc.component.html',
  styleUrls: ['./validate-secondment-studyleave-sc.component.scss']
})
export class ValidateSecondmentStudyleaveScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  terminationDetails: TerminateContributorDetails;
  disableReturn: boolean = false;
  title: string;
  engagement: EngagementDetails;
  terminationReason = TerminationReason;

  /** Creates an instance of ValidateSecondmentStudyleaveScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly terminateContributorService: TerminateContributorService,
    readonly workflowService: WorkflowService,
    readonly engagementService: EngagementService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
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
    super.getSystemParameters();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.getDataForView();
    if (
      (this.channel === Channel.HRSD || this.channel === Channel.MASAR || this.channel === Channel.AJEER) &&
      (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR)
    ) {
      this.disableReturn = true;
    }
    if (this.routerData?.resourceType) {
      this.title = this.getHeading();
    }
  }

  /** Method to get data for view. */
  getDataForView() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.engagementService
            .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, undefined, false)
            .pipe(
              tap(res => {
                // this.engagement = res;
                this.terminationDetails = res?.terminationDetails;
              })
            );
        }),
        switchMap(() => {
          return super.getDocuments(
            this.terminationDetails.leavingReason.english === this.terminationReason.SECONDMENT
              ? DocumentTransactionId.REGISTER_SECONDMENT
              : DocumentTransactionId.REGISTER_STUDY_LEAVE,
            this.terminationDetails.leavingReason.english === this.terminationReason.SECONDMENT
              ? DocumentTransactionType.REGISTER_SECONDMENT
              : DocumentTransactionType.REGISTER_STUDY_LEAVE,
            this.engagementId,
            this.routerData.transactionId
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getHeading() {
    if (this.routerData?.resourceType === 'Register Secondment') {
      return 'CONTRIBUTOR.REGISTER-SECONDMENT-ENGAGEMENT';
    } else {
      return 'CONTRIBUTOR.REGISTER-STUDY-LEAVE';
    }
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
  /** Method to get engagement details. */
  // getEngagementDetails() {
  //   return this.getEngagement(this.contributor.contributorType !== ContributorTypesEnum.SAUDI).pipe(
  //     tap(res => this.checkChangeInLegalEntity(res.establishmentLegalEntity?.english)),
  //     switchMap(res =>
  //       iif(
  //         () => !this.legalEntityChanged && this.contributor.contributorType === ContributorTypesEnum.SAUDI,
  //         this.getEngagement(true),
  //         of(res)
  //       )
  //     ),
  //     tap(res => this.setEngagementDetails(res))
  //   );
  // }

  /** Method to get engagement. */
  getEngagement(isCoverageRequired: boolean) {
    return this.engagementService.getEngagementDetails(
      this.registrationNo,
      this.socialInsuranceNo,
      this.engagementId,
      undefined,
      isCoverageRequired
    );
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
