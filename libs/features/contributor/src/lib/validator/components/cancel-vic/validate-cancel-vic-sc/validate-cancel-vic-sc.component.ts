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
import { pensionReformEligibility } from '@gosi-ui/features/contributor/lib/shared/models/pr-eligibility';
import moment from 'moment-timezone';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { CancelContributorDetails, Contributor, VicContributionDetails } from '../../../../shared/models';
import {
  CancelVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  VicService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-cancel-vic-sc',
  templateUrl: './validate-cancel-vic-sc.component.html',
  styleUrls: ['./validate-cancel-vic-sc.component.scss']
})
export class ValidateCancelVicScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  cancellationDetails: CancelContributorDetails;
  vicContributionDetails: VicContributionDetails;
  transactionTypes: string[] = [DocumentTransactionType.CANCEL_VIC, DocumentTransactionType.BANK_UPDATE];
  bankDetails: BankAccount;
  nin: number;
  isVerified: boolean = true;
  isVerifiedAlert: boolean;
  isVerifiedStatus: boolean = false;
  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean = false;
  lang: string;

  /** Creates an instance of ValidateCancelVicScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly engagementService: EngagementService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly cancelVicService: CancelVicService,
    readonly vicService: VicService,
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
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.alertService.clearAlerts();
    super.getDefaultLookupValues();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getSystemParameters();
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
        switchMap(async () => this.getVerified()),
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

  /** Method to handle workflow events. */
  vicCancelWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit(tabIndex: number) {
    this.routerData.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_CANCEL_VIC_EDIT]);
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
