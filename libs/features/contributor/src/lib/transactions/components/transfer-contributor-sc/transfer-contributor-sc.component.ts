import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
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
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { Establishment, TransferContributorDetails } from '../../../shared/models';
import {
  EngagementService,
  EstablishmentService,
  ContributorService,
  TransferContributorService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-transfer-contributor-sc',
  templateUrl: './transfer-contributor-sc.component.html',
  styleUrls: ['./transfer-contributor-sc.component.scss']
})
export class TransferContributorScComponent extends TransactionBaseScComponent implements OnInit {
  transferDetails: TransferContributorDetails;
  isIndividualApp = false;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly transferContributorService: TransferContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData,
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
    super.getTransactionDetails();
    this.getDataToDisplay();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }

  getDataToDisplay() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.getTransferDetails();
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.TRANSFER_ENGAGEMENT,
            DocumentTransactionType.TRANSFER_ENGAGEMENT,
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

  /** Method to get transfer details. */
  getTransferDetails(){
    return this.transferContributorService
      .getTransferDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(
        tap(res => (this.transferDetails = res)),
      );
  }
}
