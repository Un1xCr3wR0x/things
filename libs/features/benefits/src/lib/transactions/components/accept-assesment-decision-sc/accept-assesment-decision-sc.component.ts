/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  CoreAdjustmentService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  BankService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  AdjustmentService,
  SanedBenefitService,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-accept-assesment-decision-sc',
  templateUrl: './accept-assesment-decision-sc.component.html',
  styleUrls: ['./accept-assesment-decision-sc.component.scss']
})
export class AcceptAssesmentDecisionScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;

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
    }
  }
}
