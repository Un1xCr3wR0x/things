import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService,
  BilingualText
} from '@gosi-ui/core';
import { ContributorRouteConstants, EngagementDetails, getTransactionType } from '../../../shared';
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
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'update-border-details-sc',
  templateUrl: './update-border-details-sc.component.html',
  styleUrls: ['./update-border-details-sc.component.scss']
})
export class UpdateBorderDetails extends TransactionBaseScComponent implements OnInit, OnDestroy {
  updatedWageListResponse: UpdatedWageListResponse;
  engagement: EngagementDetails;
  errorMessage: BilingualText = new BilingualText();
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
    public changePersonService: ChangePersonService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
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
    this.getTransactionDetails();
    this.fetchDataForView();
  }

  /** Method to retrieve data for validator view. */
  fetchDataForView() {
    // console.log('registrationNo', this.registrationNo);
    // console.log('socialInsuranceNo', this.socialInsuranceNo);
    super
      .getDocuments(
        DocumentTransactionId.UPDATE_BORDER_NUMBER,
        DocumentTransactionType.UPDATE_BORDER_NUMBER,
        null,
        this.referenceNo
      )
      .subscribe();
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
              DocumentTransactionId.UPDATE_BORDER_NUMBER,
              DocumentTransactionType.UPDATE_IQAMA_NUMBER,
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
