/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../../base';
import {
  CoreAdjustmentService,
  DocumentService,
  TransactionService,
  Transaction,
  AlertService,
  LookupService,
  RouterData,
  RouterDataToken,
  Channel,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService
} from '@gosi-ui/core';
import {
  showErrorMessage,
  UiBenefitsService,
  ManageBenefitService,
  AnnuityResponseDto,
  DependentService,
  BankService,
  HeirBenefitService,
  BenefitDocumentService,
  BenefitType,
  UITransactionType,
  Benefits,
  SanedBenefitService,
  createDetailForm,
  bindQueryParamsToForm,
  BenefitDetails,
  EligibilityMonths,
  EligibilityMonthsAmount,
  UnemploymentResponseDto,
  MonthYearLabel,
  BenefitPropertyService,
  BenefitConstants
} from '../../../shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import moment from 'moment-timezone';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-request-saned-benefit-sc',
  templateUrl: './request-saned-benefit-sc.component.html',
  styleUrls: ['./request-saned-benefit-sc.component.scss']
})
export class RequestSanedBenefitScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  paymentDetails;
  contributorDetails: AnnuityResponseDto;
  pageName: String = 'requestSanedBenefit';
  uiEligibility: Benefits;
  transactionType: UITransactionType;
  channel: Channel;
  requestSanedForm: FormGroup;
  benefitDetailsSaned: BenefitDetails;
  eligibleMonths: EligibilityMonths[];
  months: number;
  eligibleMonthAmount: EligibilityMonthsAmount;
  eligibleMonthsAmounts: EligibilityMonthsAmount[] = [];
  benefitRequest: UnemploymentResponseDto;
  isIndividualApp: boolean;

  constructor(
    readonly uiBenefitsService: UiBenefitsService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly uiBenefitService: UiBenefitsService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly authTokenService: AuthTokenService,
    readonly router: Router,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly ohService: OhService
  ) {
    super(
      documentService,
      manageBenefitService,
      dependentService,
      alertService,
      bankService,
      lookUpService,
      heirBenefitService,
      adjustmentService,
      sanedBenefitService,
      uiBenefitService,
      modalService,
      router,
      fb,
      routerData,
      benefitPropertyService,
      ohService
    );
  }
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.channel === Channel.GOSI_ONLINE) {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.requestSanedForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.requestSanedForm);
    this.intialiseTheView(this.routerData);
    /* Setting rejection Indicatior */
    super.getRejectionReason(this.requestSanedForm);
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.channel === Channel.GOSI_ONLINE) {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }

    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.getUIEligibilityDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, BenefitType.ui);
      this.getBenefitRequestDetails();
      // this.getUIEligibilityDetails(this.sin, BenefitType.ui);
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
    }

    // this.uiBenefitsService
    //   .getUiBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
    //   .subscribe(
    //     res => {
    //       this.contributorDetails = res;
    //     },
    //     err => {
    //       if (err.status === 500 || err.status === 422 || err.status === 400) {
    //         this.showErrorMessages(err);
    //         this.goToTop();
    //       }
    //     }
    //   );

    // this.uiBenefitsService.getUiPaymentDetails(this.sin, this.benefitRequestId).subscribe(
    //   res => {
    //     this.paymentDetails = res;
    //   },
    //   err => {
    //     if (err.status === 500 || err.status === 422 || err.status === 400) {
    //       this.showErrorMessages(err);
    //       this.goToTop();
    //     }
    //   }
    // );
  }

  /**
   * Method to fetch the contributor and saned details
   */
  getBenefitRequestDetails() {
    if (this.sin && this.benefitRequestId && this.referenceNumber) {
      this.sanedBenefitService
        .getBenefitRequestDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(
          res => {
            if (res) {
              this.benefitRequest = res;
              this.personNameEnglish = this.benefitRequest.contributorName.english;
              this.personNameArabic = this.benefitRequest.contributorName.arabic;
              this.requestDate = this.benefitRequest.requestDate;
              this.getBenefitCalculationDetails();
              if (this.benefitRequest.personId) {
                this.benefitPropertyService.setPersonId(this.benefitRequest.personId);
                this.getBankDetails(this.benefitRequest.personId.toString(), null, true);
              }
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }

  /**
   * Method to fetch the contributor and saned details from Json
   */
  getBenefitCalculationDetails() {
    this.sanedBenefitService.getBenefitCalculationsForSaned(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.requestDate).subscribe(
      res => {
        this.benefitDetailsSaned = res;
        if (this.benefitDetailsSaned.initialMonths && this.benefitDetailsSaned.remainingMonths) {
          this.months = this.benefitDetailsSaned.initialMonths.noOfMonths;
          this.benefitDetailsSaned.remainingMonths.noOfMonths = this.months + 1;
        }
        if (!this.benefitDetailsSaned.initialMonths && this.benefitDetailsSaned.availedMonths) {
          this.benefitDetailsSaned.remainingMonths.noOfMonths = this.benefitDetailsSaned.availedMonths + 1;
        }
        this.eligibleMonths = res.eligibleMonths;
        if (this.eligibleMonths) {
          this.eligibleMonths.forEach(eligibilityMonths => {
            this.eligibleMonthAmount = new EligibilityMonthsAmount();

            this.eligibleMonthAmount.yearLabel = moment(eligibilityMonths.month.gregorian).toDate().getFullYear();
            this.eligibleMonthAmount.monthLabel =
              Object.values(MonthYearLabel)[moment(eligibilityMonths.month.gregorian).toDate().getMonth()];
            this.eligibleMonthAmount.amount = eligibilityMonths.amount;
            this.eligibleMonthsAmounts.push(this.eligibleMonthAmount);
          });
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** method to get reason for benefit*/
  getUIEligibilityDetails(sin: number, benefitType: string) {
    this.uiBenefitService.getEligibleUiBenefitByType(sin, benefitType).subscribe(
      data => {
        if (data) {
          this.uiEligibility = data;
          let transactionKey = UITransactionType.REQUEST_SANED;
          if (this.uiEligibility?.appeal) {
            transactionKey = UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE;
          }
          this.getDocuments(transactionKey, this.transactionType, this.benefitRequestId);
          if (data.benefitType && data.benefitType.english === this.benefitType) {
            if (data.warningMessages) {
              this.alertService.showWarning(data.warningMessages[0]);
            }
          }
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
      });
  }
  navigateToContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)]);
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
}
