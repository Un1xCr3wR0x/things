import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LookupService,
  DocumentService,
  TransactionService,
  RouterDataToken,
  RouterData,
  AlertService,
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../../shared';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../../shared/services';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType, EngagementDetails, ReactivateEngagementDetails } from '@gosi-ui/features/contributor/lib/shared';
import { noop, throwError } from 'rxjs';

@Component({
  selector: 'cnt-transactions-reactivate-engagement-sc',
  templateUrl: './transactions-reactivate-engagement-sc.component.html',
  styleUrls: ['./transactions-reactivate-engagement-sc.component.scss']
})
export class TransactionsReactivateEngagementScComponent extends TransactionBaseScComponent implements OnInit {
  reactivateEngagements: ReactivateEngagementDetails;
  engagement: EngagementDetails;
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router
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
       this.initializeView();
  }

  /** Method to initialize validator view. */
  initializeView() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.manageWageService
          .getEngagementsreactivate(this.registrationNo,this.socialInsuranceNo,this.engagementId)
            .pipe(tap(res =>{this.reactivateEngagements = res; 
             this.engagement = this.reactivateEngagements.engagements;}));
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.REACTIVATE_ENGAGEMENT,
            DocumentTransactionType.REACTIVATE_ENGAGEMENT,
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
