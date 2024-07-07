import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  DocumentService,
  IdentityTypeEnum,
  LanguageToken,
  LookupService,
  NIN,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject, Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { CancelContributorDetails, Contributor, VicContributionDetails } from '../../../shared/models';
import { pensionReformEligibility } from '../../../shared/models/pr-eligibility';
import {
  CancelVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-cancel-vic-sc',
  templateUrl: './cancel-vic-sc.component.html',
  styleUrls: ['./cancel-vic-sc.component.scss']
})
export class CancelVicScComponent extends TransactionBaseScComponent implements OnInit {
  /**Local variables */
  cancellationDetails: CancelContributorDetails;
  vicContributionDetails: VicContributionDetails;
  transactionTypes: string[] = [DocumentTransactionType.CANCEL_VIC, DocumentTransactionType.BANK_UPDATE];
  bankDetails: BankAccount;
  nin: number;
  isIndividualApp = false;
  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean = false;
  lang: string;

  /** Creates an instance of ValidateCancelVicScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly cancelVicService: CancelVicService,
    readonly vicService: VicService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
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
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    super.getTransactionDetails();
    if (this.socialInsuranceNo && this.engagementId) this.initializeVICCancel();
  }
  /** Method to initialize the validator view. */
  initializeVICCancel(): void {
    this.getContributorDetails()
      .pipe(
        tap(res => (this.nin = this.getNin(res.person.identity.findIndex(id => id.idType === IdentityTypeEnum.NIN)))),
        switchMap(() => this.checkEligibility()), //comment #forDisable
        switchMap(() => this.getCancelContributorDetails()),
        switchMap(() =>
          this.getVicContributionDetails(
            this.cancellationDetails.leavingDate
              ? moment(this.cancellationDetails.leavingDate.gregorian).format('YYYY-MM-DD')
              : null
          )
        ),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.CANCEL_VIC,
            this.transactionTypes,
            this.engagementId,
            this.referenceNo
          );
        }),
        switchMap(() => this.getBankAccount()),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to fetch vic cancellation details. */
  getCancelContributorDetails(): Observable<CancelContributorDetails> {
    return this.cancelVicService
      .getCancellationDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(tap(res => (this.cancellationDetails = res)));
  }

  /** Method to fetch vic contributor details. */
  getVicContributionDetails(date: string): Observable<VicContributionDetails> {
    return this.vicService
      .getVicContributionDetails(this.nin, this.engagementId, date, 'Cancel VIC')
      .pipe(tap(res => (this.vicContributionDetails = res)));
  }

  /** Method to get bank account. */
  getBankAccount() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(tap(res => (res ? (this.bankDetails = res) : (this.bankDetails = this.contributor.bankAccountDetails[0]))));
  }

  /** Method to get contributor details. */
  getContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(
        this.socialInsuranceNo,
        new Map().set('includeBankAccountInfo', true).set('checkBeneficiaryStatus', true)
      )
      .pipe(tap(res => ((this.contributor = res), (this.isBeneficiary = this.contributor.isBeneficiary))));
  }
  /** Method to check pension-reform-eligibility. */
  checkEligibility() {
    return this.contributorService.checkEligibilityNin(this.nin).pipe(
      tap(res => {
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isPREligible = false;
        } else {
          this.isPREligible = true;
        }
      })
    );
  }
  /** Method to get nin. */
  getNin(index: number) {
    return this.contributor.person.identity[index] ? (<NIN>this.contributor.person.identity[index]).newNin : null;
  }
}
