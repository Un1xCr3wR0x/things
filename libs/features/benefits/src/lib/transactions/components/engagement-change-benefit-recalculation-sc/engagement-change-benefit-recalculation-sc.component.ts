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
  RouterData,
  RouterDataToken,
  LookupService
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../../base';
import {
  showErrorMessage,
  ManageBenefitService,
  AnnuityResponseDto,
  HeirBenefitService,
  DependentDetails,
  BenefitRecalculation,
  DependentService,
  BankService,
  BenefitConstants,
  SanedRecalculation,
  SanedBenefitService,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-engagement-change-benefit-recalculation-sc',
  templateUrl: './engagement-change-benefit-recalculation-sc.component.html',
  styleUrls: ['./engagement-change-benefit-recalculation-sc.component.scss']
})
export class EngagementChangeBenefitRecalculationScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  contributorDetails: AnnuityResponseDto;
  benefitDetails: AnnuityResponseDto;
  benefitRecalculationDetails: BenefitRecalculation;
  sanedRecalculationDetails: SanedRecalculation;
  readonly benefitConstants = BenefitConstants;
  modificationDetails = {
    engagements: [
      {
        periodBeforeModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        periodAfterModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        wageBeforeModification: 5000,
        wageAfterModification: 6000
      },
      {
        periodBeforeModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        periodAfterModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        wageBeforeModification: 5000,
        wageAfterModification: 6000
      }
    ]
  };
  heirAccordianPresent = true;
  heirList: DependentDetails[];
  pageName: String = 'engagementChange';
  lang = 'en';
  payload;

  constructor(
    readonly documentService: DocumentService,
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
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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
    this.language.subscribe(language => {
      this.lang = language;
    });
    // this.payload = JSON.parse(this.routerData.payload);
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
    }

    this.getBenefits();
    this.getBenefitRecalculation();
    this.fetchAnnuityCalculation(this.sin, this.benefitRequestId, this.referenceNumber);
    this.calculationModalTitle = { title1: 'BENEFITS.NEW-BENEFIT', title2: 'BENEFITS.CURRENT-BENEFIT' };

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

  // fetchHeirs() {
  //   this.heirBenefitService
  //     .getHeirById(this.sin, this.benefitRequestId.toString(), this.referenceNumber, this.benefitType ?.english, null)
  //     .subscribe(val => {
  //       this.heirList = val;
  //     });
  // }

  getBenefits() {
    this.manageBenefitService.getBenefitDetails(this.sin, this.benefitRequestId).subscribe(res => {
      this.benefitDetails = res;
    });
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
