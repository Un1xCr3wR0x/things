import { Component, OnInit, Inject } from '@angular/core';
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterData,
  RouterDataToken,
  AlertService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  Channel
} from '@gosi-ui/core';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared';
import { TerminateContributorDetails, CancelContributorDetails } from '../../../shared/models';
import {
  ContributorService,
  EstablishmentService,
  TerminateContributorService,
  EngagementService,
  CancelContributorService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { Router } from '@angular/router';

@Component({
  selector: 'cnt-cancel-engagement-sc',
  templateUrl: './cancel-engagement-sc.component.html',
  styleUrls: ['./cancel-engagement-sc.component.scss']
})
export class CancelEngagementScComponent extends TransactionBaseScComponent implements OnInit {
  cancellationDetails: CancelContributorDetails;
  terminationDetails: TerminateContributorDetails;
  isIndividualApp = false;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly terminateContributorService: TerminateContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly cancelContributorService: CancelContributorService,
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly alertService: AlertService,
    readonly router: Router,
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
    super.getTransactionDetails();
    // To do : remove the check for individual app, individual app API changes not implemented for contributor transaction screens
    if (!this.isIndividualApp) {
      this.getDataForView();
    }
  }
  getDataForView() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.cancelContributorService
            .getCancellationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(tap(res => (this.cancellationDetails = res)));
        }),
        switchMap(() => {
          return this.channel?.english === Channel.TAMINATY_INDIVIDUAL && this.isPPA
            ? super.getAllDocuments(this.referenceNo)
            : super.getDocuments(
                DocumentTransactionId.CANCEL_CONTRIBUTOR,
                this.channel?.english === Channel.TAMINATY_INDIVIDUAL
                  ? [
                      DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL,
                      DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN
                    ]
                  : this.getDocumentTransactionType(),
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
}
