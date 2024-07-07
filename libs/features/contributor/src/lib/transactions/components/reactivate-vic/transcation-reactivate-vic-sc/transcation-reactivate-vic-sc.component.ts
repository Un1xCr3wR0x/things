import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { AlertService, DocumentService, LookupService, TransactionService } from '@gosi-ui/core/lib/services';
import { AddVicService, ContributorService, DocumentTransactionId, DocumentTransactionType, EngagementDetails, EngagementService, EstablishmentService, ManageWageService, ReactivateEngagementDetails, VicService } from '@gosi-ui/features/contributor/lib/shared';
import { TransactionBaseScComponent } from '../../shared';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { noop, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs-compat';

@Component({
  selector: 'cnt-transcation-reactivate-vic-sc',
  templateUrl: './transcation-reactivate-vic-sc.component.html',
  styleUrls: ['./transcation-reactivate-vic-sc.component.scss']
})
export class TranscationReactivateVicScComponent extends TransactionBaseScComponent implements OnInit {

  reactivateEngagements: ReactivateEngagementDetails;
  engagement: EngagementDetails;
  lang = 'en';


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
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
    this.language.subscribe(res => (this.lang = res));
  }

  ngOnInit(): void {
    super.getTransactionDetails();
    this.initializeView();
  }


  initializeView() {
    this.manageWageService
      .getEngagementsreactivatevicmyTxn(this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(
        switchMap(res => {
          this.reactivateEngagements = res;
          this.engagement = this.reactivateEngagements.engagements;
          return super.getDocuments(
            DocumentTransactionId.REACTIVATE_VIC_ENGAGEMENT,
            DocumentTransactionType.REACTIVATE_VIC_ENGAGEMENT,
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
