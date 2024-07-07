/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../../base';
import {
  CoreAdjustmentService,
  Transaction,
  DocumentService,
  TransactionService,
  RouterDataToken,
  LanguageToken,
  RouterData,
  AlertService,
  LookupService,
  Channel,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  formatDate,
  RouterConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreContributorService
} from '@gosi-ui/core';
import {
  AdjustmentRepayment,
  BankService,
  BenefitConstants,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  UITransactionType,
  SanedBenefitService,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ThirdpartyAdjustmentService } from '@gosi-ui/features/payment/lib/shared';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';
@Component({
  selector: 'bnt-pay-adjustment-sc',
  templateUrl: './pay-adjustment-sc.component.html',
  styleUrls: ['./pay-adjustment-sc.component.scss']
})
export class PayAdjustmentScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  isSadad = false;
  adjustmentRepayDetails: AdjustmentRepayment;
  referenceNumber: number;
  businessId: number;
  adjustmentType: string;
  channel = 'field-office';
  adjRepayId: number;
  authorizedPersonId: CommonIdentity | null;
  identifier: number;
  lang = 'en';
  sin: number;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly thirdPartyService: ThirdpartyAdjustmentService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public contributorService: CoreContributorService,
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
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transaction = this.transactionService.getTransactionDetails();
    const transactionName = UITransactionType.MNT_ADJUSTMENT_REPAYMENT;
    const transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.businessId = this.transaction.params.BUSINESS_ID;
      this.adjRepayId = this.transaction.params.ADJUSTMENT_REPAY_ID;
      this.identifier = parseInt(this.transaction.params.IDENTIFIER, 10);
      this.sin = this.transaction.params.SIN;
      this.getDocumentDetails(transactionName, transactionType, this.adjRepayId, this.referenceNumber);
      this.getContributor();
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.adjustmentType =
      this.channel === Channel.FIELD_OFFICE
        ? BenefitConstants.REQUEST_BENEFIT_FO
        : BenefitConstants.REQUEST_BENEFIT_GOL;
    this.heirBenefitService
      .fetchAdjustmentRepayment(this.adjRepayId, this.identifier, this.referenceNumber, this.sin)
      .subscribe(res => {
        this.adjustmentRepayDetails = res;
        this.heirBenefitService.setAdjustmentRepaymentDetails(res);
        this.isSadad = this.adjustmentRepayDetails?.repaymentDetails?.paymentMethod?.english === BenefitConstants.SADAD;
        this.authorizedPersonId = checkIqamaOrBorderOrPassport(this.adjustmentRepayDetails?.contributor?.identity);
      });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.contributorService.selectedSIN = this.socialInsuranceNo;
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  getContributor() {
    this.thirdPartyService.getPersonById(this.identifier).subscribe(data => {
      this.socialInsuranceNo = data?.socialInsuranceNo;
    });
  }
  navigateToAdjustment(adjustmentId: number) {
    this.adjustmentService.identifier = this.identifier;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: { adjustmentId: adjustmentId }
    });
  }
}
