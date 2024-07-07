/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../../base';
import {
  Transaction,
  DocumentService,
  TransactionService,
  LookupService,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  BankService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  MiscellaneousPaymentRequest,
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
  selector: 'bnt-direct-payment-sc',
  templateUrl: './direct-payment-sc.component.html',
  styleUrls: ['./direct-payment-sc.component.scss']
})
export class DirectPaymentScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  validDetails: MiscellaneousPaymentRequest;
  miscPaymentId: number;

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
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.miscPaymentId = this.routerData.idParams.get('miscPaymentId');
    }
  }
  /** method to get Contributor details */
  getContributorDetailService() {
    this.benefitPropertyService.validatorDetails(this.requestId, this.miscPaymentId).subscribe(data => {
      this.validDetails = data;
    });
  }
}
