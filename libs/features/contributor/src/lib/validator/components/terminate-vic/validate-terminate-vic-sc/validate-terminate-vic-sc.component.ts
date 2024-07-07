/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BankAccount,
  DocumentService,
  IdentityTypeEnum,
  LanguageToken,
  LookupService,
  NIN,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import * as moment from 'moment-timezone';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { Contributor, TerminateContributorDetails, VicContributionDetails } from '../../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  TerminateVicService,
  VicService,
  VicWageUpdateService
} from '../../../../shared/services';
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';

@Component({
  selector: 'cnt-validate-terminate-vic-sc',
  templateUrl: './validate-terminate-vic-sc.component.html',
  styleUrls: ['./validate-terminate-vic-sc.component.scss']
})
export class ValidateTerminateVicScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  terminateVicDetails: TerminateContributorDetails;
  vicContributionDetails: VicContributionDetails;
  transactionTypes: string[] = [DocumentTransactionType.TERMINATE_VIC, DocumentTransactionType.BANK_UPDATE];
  bankDetails: BankAccount;
  nin: number;
  isVerified: boolean = true;
  isVerifiedAlert: boolean;
  isVerifiedStatus: boolean = false;
  lang: string;
  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean;

  /** Creates an instance of ValidateAddVicScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly engagementService: EngagementService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly vicService: VicService,
    readonly terminateVicService: TerminateVicService,
    readonly updateVicService: VicWageUpdateService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) private routerData: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    super.getDefaultLookupValues();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getSystemParameters();
    if (this.socialInsuranceNo && this.engagementId) this.initializeTerminateVic();
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
        switchMap(async () => this.getVerified()),
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

  /** Method to get bank account. */
  getBankAccount() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(tap(res => (res ? (this.bankDetails = res) : (this.bankDetails = this.contributor.bankAccountDetails[0]))));
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
  /** Method to navigate to validator edit. */
  navigateToEdit(tabIndex: number) {
    this.routerData.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_VIC_EDIT]);
  }

  /** Method to handle workflow events. */
  terminateVicWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }

  // method to verify the bank status
  getVerified() {
    if (this.contributor.bankAccountDetails[0].verificationStatus === 'Sama Verified') {
      this.isVerified = false;
      this.isVerifiedStatus = false;
    } else {
      this.isVerifiedStatus = true;
    }
    if (this.contributor.bankAccountDetails[0].verificationStatus === 'Sama Verification Pending') {
      this.isVerifiedAlert = true;
    } else if (this.contributor.bankAccountDetails[0].verificationStatus === 'Sama Verification Failed') {
      this.isVerifiedAlert = false;
    }
  }

  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
