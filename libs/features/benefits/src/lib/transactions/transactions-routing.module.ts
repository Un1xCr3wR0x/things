/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  HoldBenefitTransactionScComponent,
  ModifyHeirScComponent,
  PayAdjustmentScComponent,
  ReemploymentTerminationBenefitRecalculationScComponent,
  RequestHeirBenefitScComponent,
  RestartBenefitTransactionScComponent,
  RestartHeirBenefitScComponent,
  ReturnLumpsumBenefitScComponent,
  SanedBenefitRecalculationScComponent,
  StopBenefitTransactionScComponent,
  StopHeirBenefitScComponent,
  TransactionDisabilityAssessmentScComponent,
  TransactionImprisonmentModifyScComponent,
  TransactionModifyCommitmentComponent,
  TransactionRetirementPensionScComponent,
  TransactionReturnLumpsumScComponent,
  TransactionSanedBenefitScComponent,
  TransactionSuspendSanedScComponent,
  HeirDirectPaymentScComponent
} from './components';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ModifyBankAccountScComponent } from './components/modify-bank-account-sc/modify-bank-account-sc.component';
import { NgModule } from '@angular/core';
import { RequestUnemploymentScComponent } from './components/request-unemployment-sc/request-unemployment-sc.component';
import { TransactionBenefitRecalculationScComponent } from './components/transaction-benefit-recalculation-sc/transaction-benefit-recalculation-sc.component';
import { TransactionDcComponent } from './transaction-dc.component';
import { TransactionFuneralGrantScComponent } from './components/transaction-funeral-grant-sc/transaction-funeral-grant-sc.component';
import { TransactionRejoiningScComponent } from './components/transaction-rejoining-sc/transaction-rejoining-sc.component';
import { TransactionRetirementLumpsumScComponent } from './components/transaction-retirement-lumpsum-sc/transaction-retirement-lumpsum-sc.component';
import {HeirRegisterScComponent} from "@gosi-ui/features/benefits/lib/validator/components/heir-register-sc/heir-register-sc.component";

const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: 'disability-assessment',
        component: TransactionDisabilityAssessmentScComponent
      },
      {
        path: 'request-heir',
        component: RequestUnemploymentScComponent
      },
      {
        path: 'request-funeral',
        component: TransactionFuneralGrantScComponent
      },
      {
        path: 'request-retirement-pension',
        component: TransactionRetirementPensionScComponent //old comp - request retirement pension
      },
      {
        path: 'modify-heir',
        component: ModifyHeirScComponent
      },
      {
        path: 'request-retirement-lumpsum',
        component: TransactionRetirementLumpsumScComponent // old component - RequestRetirementLumpsumScComponent
      },
      {
        path: 'request-saned',
        component: TransactionSanedBenefitScComponent
      },
      {
        path: 'suspend-saned',
        component: TransactionSuspendSanedScComponent
      },
      {
        path: 'hold-heir',
        component: TransactionRetirementPensionScComponent
      },
      {
        path: 'start-heir',
        component: TransactionRetirementPensionScComponent
      },
      {
        path: 'stop-heir',
        component: StopHeirBenefitScComponent
      },
      {
        path: 'benefit-recalculation-engagement-change',
        component: TransactionBenefitRecalculationScComponent
      },
      {
        path: 'benefit-recalculation-reemployment-termination',
        component: TransactionRejoiningScComponent
      },
      {
        path: 'jailed-contributor-benefit',
        component: TransactionImprisonmentModifyScComponent
      },
      {
        path: 'return-lumpsum-benefit',
        component: TransactionReturnLumpsumScComponent
      },
      {
        path: 'enable-return-lumpsum-benefit',
        component: ReturnLumpsumBenefitScComponent
      },
      {
        path: 'request-heir-pension',
        component: TransactionRetirementPensionScComponent
      },
      {
        path: 'request-heir-lumpsum',
        component: TransactionRetirementLumpsumScComponent
      },
      {
        path: 'pay-adjustments',
        component: PayAdjustmentScComponent
      },
      {
        path: 'saned-benefit-recalculations',
        component: SanedBenefitRecalculationScComponent
      },
      {
        path: 'modify-bank-account',
        component: ModifyBankAccountScComponent
      },
      {
        path: 'modify-commitment',
        component: TransactionModifyCommitmentComponent
      },
      {
        path: 'restart-heir',
        component: RestartHeirBenefitScComponent
      },
      {
        path: 'restart-pension',
        component: RestartBenefitTransactionScComponent
      },
      {
        path: 'hold-benefit',
        component: HoldBenefitTransactionScComponent
      },
      {
        path: 'stop-benefit',
        component: StopBenefitTransactionScComponent
      },
      {
        path: 'heir-direct-payment',
        component: HeirDirectPaymentScComponent
      },
      {
        path: 'validate-heir-registration',
        component: HeirRegisterScComponent,
        data: {
          breadcrumb: 'BENEFITS.REGISTER-HEIR-HEADING'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
