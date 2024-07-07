import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ApplicationTypeToken, DocumentService, LanguageToken, LookupService, RouterData, RouterDataToken, TransactionService, checkBilingualTextNull } from '@gosi-ui/core';
import { ContributorService, ContributorsWageService, EngagementService, EstablishmentService, RpaServices, SearchEngagementResponse, TransferContributorService } from '@gosi-ui/features/contributor';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'cnt-cancel-rpa-transcation-sc',
  templateUrl: './cancel-rpa-transcation-sc.component.html',
  styleUrls: ['./cancel-rpa-transcation-sc.component.scss']
})
export class CancelRpaTranscationScComponent extends TransactionBaseScComponent implements OnInit {

  sin: number;
  cancelEngagment: SearchEngagementResponse;

  constructor(readonly contributorService: ContributorService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly location: Location,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly transferContributorService: TransferContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly rpaService: RpaServices,
    readonly contributorWageService: ContributorsWageService,
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
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
    this.getIndividualContributorDetails();
    this.getCancelRpaDetails();
  }

  getCancelRpaDetails() {
    this.rpaService.getEngagementFullDetailsCancelRpaMytxn(this.socialInsuranceNo, true,this.referenceNo).subscribe(res => {
      this.cancelEngagment = res;
    });
  }

    /** Method to get contributor details. */
    getIndividualContributorDetails() {
      this.contributorService.getIndividualContDetails(this.socialInsuranceNo).subscribe(
        res => {
          this.contributor = res;
        },
        err => {
          if (err.error) {
            this.alertService.showError(err.error);
          }
        }
      );
    }

    checkNull(control) {
      return checkBilingualTextNull(control);
    }

}
