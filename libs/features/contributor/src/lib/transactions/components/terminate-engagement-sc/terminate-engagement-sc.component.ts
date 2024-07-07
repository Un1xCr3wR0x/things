import { Component, OnInit, Inject } from '@angular/core';
/*import { ContributorService } from '../../../shared/services/contributor.service';*/
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterData,
  RouterDataToken,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel
} from '@gosi-ui/core';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared';
import { TerminateContributorDetails } from '../../../shared/models';
import {
  ContributorService,
  EstablishmentService,
  TerminateContributorService,
  EngagementService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { Router } from '@angular/router';
@Component({
  selector: 'cnt-terminate-engagement-sc',
  templateUrl: './terminate-engagement-sc.component.html',
  styleUrls: ['./terminate-engagement-sc.component.scss']
})
export class TerminateEngagementScComponent extends TransactionBaseScComponent implements OnInit {
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
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true).set('includeBankAccountInfo', true))
      .pipe(
        switchMap(() => {
          return this.terminateContributorService
            .getTerminationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(tap(res => (this.terminationDetails = res)));
        }),
        switchMap(() => {
          if (this.terminationDetails?.secondment || this.terminationDetails?.studyLeave) {
            return super.getDocuments(
              DocumentTransactionId.TERMINATE_CONTRIBUTOR,
              this.terminationDetails?.secondment
                ? DocumentTransactionType.TERMINATE_SECONDMENT
                : DocumentTransactionType.TERMINATE_STUDY_LEAVE,
              this.engagementId,
              this.routerData.transactionId
            );
          } else
            return this.channel?.english === Channel.TAMINATY_INDIVIDUAL && this.isPPA
              ? super.getAllDocuments(this.referenceNo)
              : super.getDocuments(
                  DocumentTransactionId.TERMINATE_CONTRIBUTOR,
                  this.channel?.english === Channel.TAMINATY_INDIVIDUAL
                    ? [
                        DocumentTransactionType.TERMINATE_ENGAGEMENT_INDIVIDUAL,
                        DocumentTransactionType.TERMINATE_ENGAGEMENT_INDIVIDUAL_ADMIN
                      ]
                    : this.establishment.gccEstablishment
                    ? DocumentTransactionType.TERMINATE_CONTRIBUTOR_IN_GCC
                    : DocumentTransactionType.TERMINATE_CONTRIBUTOR,
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
}
