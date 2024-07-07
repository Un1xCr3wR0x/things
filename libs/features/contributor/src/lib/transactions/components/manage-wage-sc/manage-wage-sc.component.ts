import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { ContributorRouteConstants, EngagementDetails } from '../../../shared';
import { throwError, noop } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { UpdatedWageListResponse } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ValidateWageUpdateService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared';

@Component({
  selector: 'cnt-manage-wage-sc',
  templateUrl: './manage-wage-sc.component.html',
  styleUrls: ['./manage-wage-sc.component.scss']
})
export class ManageWageScComponent extends TransactionBaseScComponent implements OnInit, OnDestroy {
  updatedWageListResponse: UpdatedWageListResponse;
  engagement: EngagementDetails;
  isIndividualApp = false;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.getTransactionDetails();
    // To do : remove the check for individual app, individual app API changes not implemented for contributor transaction screens
    if (!this.isIndividualApp) {
      this.fetchDataForView();
      this.fetchEngagementDataForView;
    }
  }

  /** Method to retrieve data for validator view. */
  fetchDataForView() {
    if (this.registrationNo && this.socialInsuranceNo) {
      super
        .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
        .pipe(
          switchMap(() => {
            return this.wageUpdateService
              .getOccupationAndWageDetails(
                this.registrationNo,
                this.socialInsuranceNo,
                this.engagementId,
                this.referenceNo
              )
              .pipe(tap((res: UpdatedWageListResponse) => (this.updatedWageListResponse = res)));
          }),
          switchMap(() => {
            return super.getDocuments(
              DocumentTransactionId.MANAGE_WAGE,
              DocumentTransactionType.MANAGE_WAGE,
              this.engagementId,
              this.routerDataToken.transactionId
            );
          }),
          catchError(err => {
            super.handleError(err, true);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /** Method to retrieve data for validator view. */
  fetchEngagementDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      super
        .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
        .pipe(
          switchMap(() => {
            return this.wageUpdateService
              .getOccupationAndWageDetails(
                this.registrationNo,
                this.socialInsuranceNo,
                this.engagementId,
                this.referenceNo
              )
              .pipe(tap((res: UpdatedWageListResponse) => (this.updatedWageListResponse = res)));
          }),
          switchMap(() => {
            return super.getDocuments(
              DocumentTransactionId.MANAGE_WAGE,
              DocumentTransactionType.MANAGE_WAGE,
              this.engagementId,
              this.routerDataToken.transactionId
            );
          }),
          catchError(err => {
            super.handleError(err, true);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /**
   * Navigate to CSR edit view from validator view
   */
  navigateToCSR() {
    this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE_EDIT]);
  }
}
