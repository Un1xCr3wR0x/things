/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

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
import * as moment from 'moment-timezone';
import { noop, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { Contributor, TerminateContributorDetails, VicContributionDetails } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  TerminateVicService,
  VicService,
  VicWageUpdateService
} from '../../../shared/services';
import { pensionReformEligibility } from '../../../shared/models/pr-eligibility';
@Component({
  selector: 'cnt-terminate-vic-sc',
  templateUrl: './terminate-vic-sc.component.html',
  styleUrls: ['./terminate-vic-sc.component.scss']
})
export class TerminateVicScComponent extends TransactionBaseScComponent implements OnInit {
  /** Local variables */
  terminateVicDetails: TerminateContributorDetails;
  vicContributionDetails: VicContributionDetails;
  transactionTypes: string[] = [DocumentTransactionType.TERMINATE_VIC, DocumentTransactionType.BANK_UPDATE];
  bankDetails: BankAccount;
  nin: number;
  isIndividualApp = false;
  lang: string;
  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean;
  
  /** Creates an instance of TerminateVicScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly vicService: VicService,
    readonly terminateVicService: TerminateVicService,
    readonly updateVicService: VicWageUpdateService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
    super.getTransactionDetails();
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.socialInsuranceNo && this.engagementId) this.initializeTerminateVic();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }
  /** Method to initialize the validator view. */
  initializeTerminateVic(): void {
    this.getContributorDetails()
      .pipe(
        switchMap(() => {
          return this.terminateVicService
            .getTerminateVicDetails(this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(
              tap(res => (this.terminateVicDetails = res)),
              switchMap(res => {
                const date = moment(res.leavingDate.gregorian).format('YYYY-MM-DD');
                return this.getVicContributionDetails(date);
              })
            );
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.TERMINATE_VIC,
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

  /** Method to get contributor all details. */
  getContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(
        this.socialInsuranceNo,
        new Map().set('includeBankAccountInfo', true).set('checkBeneficiaryStatus', true)
      )
      .pipe(
        tap(res => {
          this.contributor = res;
          this.isBeneficiary = this.contributor.isBeneficiary;
          this.nin = this.getNin(this.contributor.person.identity.findIndex(id => id.idType === IdentityTypeEnum.NIN));
        })
      );
  }

  /** Method to get nin identifier. */
  getNin(index: number) {
    return this.contributor.person.identity[index] ? (<NIN>this.contributor.person.identity[index]).newNin : null;
  }

  /** Method to fetch vic contributor details. */
  getVicContributionDetails(date?: string): Observable<VicContributionDetails> {
    return this.vicService
      .getVicContributionDetails(this.nin, this.engagementId, date)
      .pipe(tap(res => (this.vicContributionDetails = res)));
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
  /** Method to get bank account. */
  getBankAccount() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(tap(res => (res ? (this.bankDetails = res) : (this.bankDetails = this.contributor.bankAccountDetails[0]))));
  }
}
