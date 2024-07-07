import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { Contributor, VicWageUpdateDetails } from '../../../shared/models';
import { pensionReformEligibility } from '../../../shared/models/pr-eligibility';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService,
  VicWageUpdateService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-vic-wage-update-sc',
  templateUrl: './vic-wage-update-sc.component.html',
  styleUrls: ['./vic-wage-update-sc.component.scss']
})
export class VicWageUpdateScComponent extends TransactionBaseScComponent implements OnInit {
  /** Local variables */
  updateVicWorkflowDetails: VicWageUpdateDetails;
  pensionReformEligibility: pensionReformEligibility;
  isEligible: boolean = false;
  isIndividualApp = false;

  /** Creates an instance of VicWageUpdateScComponent */
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly updateVicService: VicWageUpdateService,
    readonly vicService: VicService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService
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
    if (this.isIndividualApp) {
      this.socialInsuranceNo = this.authTokenService.getIndividual();
    }
    super.getTransactionDetails();
    if (this.socialInsuranceNo && this.engagementId) this.initializeVICWagePage();
  }

  /** Method to initialize the validator view. */
  initializeVICWagePage(): void {
    this.checkEligibility(); //comment #forDisable
    this.getContributorDetails()
      .pipe(
        switchMap(() =>
          this.updateVicService
            .getVicWageUpdateDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(tap(res => (this.updateVicWorkflowDetails = res)))
        ),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.MANAGE_VIC_WAGE,
            DocumentTransactionType.MANAGE_VIC_WAGE,
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

  /** Method to get contributor all details. */
  getContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(this.socialInsuranceNo, new Map().set('checkBeneficiaryStatus', true))
      .pipe(tap(res => ((this.contributor = res), (this.isBeneficiary = this.contributor.isBeneficiary))));
  }

  checkEligibility(): void {
    this.contributorService.checkEligibilityNin(this.NIN).subscribe(res => {
      this.pensionReformEligibility = res;
      if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
        this.isEligible = false;
      } else {
        this.isEligible = true;
      }
    });
  }
}
