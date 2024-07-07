/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import {
  CoreAdjustmentService,
  DocumentService,
  Transaction,
  TransactionService,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  LookupService
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../../base';
import {
  ManageBenefitService,
  AnnuityResponseDto,
  showErrorMessage,
  BenefitRecalculation,
  DependentService,
  BenefitDocumentService,
  BankService,
  HeirBenefitService,
  SanedBenefitService,
  BenefitConstants,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-reemployment-termination-benefit-recalculation-sc',
  templateUrl: './reemployment-termination-benefit-recalculation-sc.component.html',
  styleUrls: ['./reemployment-termination-benefit-recalculation-sc.component.scss']
})
export class ReemploymentTerminationBenefitRecalculationScComponent
  extends TransactionBaseScComponent
  implements OnInit
{
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  contributorDetails: AnnuityResponseDto;
  benefitDetails: AnnuityResponseDto;
  benefitRecalculationDetails: BenefitRecalculation;
  pageName: String = 'terminationOfReemployment';
  lang = 'en';
  readonly benefitConstants = BenefitConstants;

  constructor(
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.setParams(this.sin, this.benefitRequestId, this.referenceNumber);
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
      this.getContributorDetails();
      this.getBenefits();
      this.getBenefitRecalculation();
    }
  }

  getContributorDetails() {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
      .subscribe(
        res => {
          this.contributorDetails = res;
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessages(err);
            this.goToTop();
          }
        }
      );
  }

  /** Method to get benefit recalculation details */
  getBenefitRecalculation() {
    this.manageBenefitService.getBenefitRecalculation(this.sin, this.benefitRequestId).subscribe(res => {
      this.benefitRecalculationDetails = res;
    });
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
}
