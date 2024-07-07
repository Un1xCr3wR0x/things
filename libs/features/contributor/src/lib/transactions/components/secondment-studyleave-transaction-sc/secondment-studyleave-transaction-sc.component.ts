import { Component, OnInit, Inject } from '@angular/core';
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterData,
  RouterDataToken,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken
} from '@gosi-ui/core';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  EngagementDetails,
  SecondmentDetailsDto,
  StudyLeaveDetailsDto
} from '../../../shared';
import { TerminateContributorDetails } from '../../../shared/models';
import {
  ContributorService,
  EstablishmentService,
  TerminateContributorService,
  EngagementService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { Router } from '@angular/router';
import { TerminationReason } from '../../../shared/enums/termination-reason';
@Component({
  selector: 'cnt-secondment-studyleave-transaction-sc',
  templateUrl: './secondment-studyleave-transaction-sc.component.html',
  styleUrls: ['./secondment-studyleave-transaction-sc.component.scss']
})
export class SecondmentStudyleaveTransactionScComponent extends TransactionBaseScComponent implements OnInit {
  isIndividualApp = false;
  engagement: EngagementDetails;
  terminationDetails: TerminateContributorDetails;
  terminationReason = TerminationReason;

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
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.engagementService
            .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, undefined, false)
            .pipe(
              tap(res => {
                this.engagement = res;
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
}
