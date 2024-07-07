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
  IdentityTypeEnum,
  LookupService,
  NIN,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { Contributor, VicWageUpdateDetails } from '../../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-vic-individual-wage-sc',
  templateUrl: './validate-vic-individual-wage-sc.component.html',
  styleUrls: ['./validate-vic-individual-wage-sc.component.scss']
})
export class ValidateVicIndividualWageScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  updateVicWorkflowDetails: VicWageUpdateDetails;
  pensionReformEligibility: pensionReformEligibility;
  isEligible: boolean = false;
  NIN: number;

  /** Creates an instance of ValidateAddVicScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly engagementService: EngagementService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly updateVicService: VicWageUpdateService,
    readonly vicService: VicService,
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
    super.getDefaultLookupValues();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getSystemParameters();
    if (this.socialInsuranceNo && this.engagementId) this.initializeVICWagePage();
  }

  /** Method to initialize the validator view. */
  initializeVICWagePage(): void {
    this.getContributorDetails()
      .pipe(
        switchMap(() =>
          this.updateVicService
            .getVicWageUpdateDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(tap(res => (this.updateVicWorkflowDetails = res)))
        ),
        switchMap(async () => this.checkEligibility()), //comment #forDisable
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.MANAGE_VIC_WAGE,
            DocumentTransactionType.MANAGE_VIC_WAGE,
            this.engagementId,
            this.referenceNo
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get contributor all details. */
  getContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(this.socialInsuranceNo, new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        tap(res => {
          this.contributor = res;
          this.isBeneficiary = this.contributor.isBeneficiary;
          this.NIN = this.getNin(this.contributor.person.identity.findIndex(id => id.idType === IdentityTypeEnum.NIN));
        })
      );
  }

  /** Method to get nin. */
  getNin(index: number) {
    return this.contributor.person.identity[index] ? (<NIN>this.contributor.person.identity[index]).newNin : null;
  }

  /** Method to handle workflow events. */
  vicWageWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit(tabIndex: number) {
    this.routerData.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_VIC_INDIVIDUAL_WAGE_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }

  checkEligibility(): void {
    this.contributorService.checkEligibilityNin(this.NIN).subscribe(res => {
      this.pensionReformEligibility = res;
      if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
        this.isEligible = false;
      } else {
        this.isEligible = true;
      }
    });
  }
}
