import { Component, Inject, OnInit } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { catchError, pluck, switchMap, tap } from 'rxjs/operators';
import {
  ContributorService,
  ContributorsWageService,
  ContributorWageParams,
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementService,
  Establishment,
  EstablishmentService,
  TransferContributorService
} from '../../../shared';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { ContributorCountDetails, TransferAllContributorDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-transfer-all-contributor-sc',
  templateUrl: './transfer-all-contributor-sc.component.html',
  styleUrls: ['./transfer-all-contributor-sc.component.scss']
})
export class TransferAllContributorScComponent extends TransactionBaseScComponent implements OnInit {
  /** Local variables */
  transferAllDetails: TransferAllContributorDetails;
  contributorDetails: ContributorCountDetails;
  requestId: number;
  isIndividualApp = false;

  /** Creates an instance of ValidateTransferAllContributorScComponent. */
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
    readonly contributorWageService: ContributorsWageService,
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

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.readTransactionDataFromToken(this.routerData);
    super.getTransactionDetails();
    //To do : remove the check for individual app, individual app API changes not implemented for contributor transaction screens
    if (!this.isIndividualApp) {
      if (this.registrationNo) this.getDataToDisplay();
    }
  }

  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.requestId) this.requestId = payload.requestId;
    }
  }

  /** Method to get data to display on page load. */
  getDataToDisplay() {
    this.getTransferAllDetails()
      .pipe(
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.TRANSFER_ALL_ENGAGEMENT,
            DocumentTransactionType.TRANSFER_ALL_ENGAGEMENT,
            this.transaction.params.TRANSFER_REQUEST_ID,
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

  /** Method to get transfer all details. */
  getTransferAllDetails(): Observable<TransferAllContributorDetails> {
    return this.transferContributorService
      .getTransferAllDetails(this.registrationNo, this.tRequestId)
      .pipe(tap(res => (this.transferAllDetails = res)));
  }

  
}
