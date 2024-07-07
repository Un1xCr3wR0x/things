/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  BenefitRecalculationScComponent,
  BenefitTypeModifyScComponent,
  BenefitTypeScComponent,
  ValidatorsRejoiningScComponent as RecalculationRejoiningScComponent,
  ValidatorBenefitRecalculationScComponent,
  ValidatorDcComponent,
  ValidatorImprisonmentModifyScComponent,
  ValidatorRetirementLumpsumScComponent,
  ValidatorReturnLumpsumScComponent,
  ValidatorSanedBenefitScComponent,
  ValidatorFuneralGrantScComponent,
  ValidatorSuspendSanedScComponent,
  ValidatorSanedCancellationScComponent,
  ValidatorDirectPaymentScComponent
} from './components';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HeirRecalculationScComponent } from './components/benefit-recalculation/heir-recalculation-sc/heir-recalculation-sc.component';
import { HeirRegisterScComponent } from './components/heir-register-sc/heir-register-sc.component';
import { ModifyBenefitPaymentDetailsScComponent } from './components/modify-benefit-payment-details-sc/modify-benefit-payment-details-sc.component';
import { NgModule } from '@angular/core';
import { ValidatorDisabilityAssessmentScComponent } from './components/validator-disability-assessment-sc/validator-disability-assessment-sc.component';
import { ValidatorHoldBenefitScComponent } from './components/validator-hold-benefit-sc/validator-hold-benefit-sc.component';
import { ValidatorModifyCommitmentScComponent } from './components/validator-modify-commitment-sc/validator-modify-commitment-sc.component';
import { ValidatorRestartBenefitScComponent } from './components/validator-restart-benefit-sc/validator-restart-benefit-sc.component';
import { ValidatorRetirementPensionScComponent } from './components/validator-retirement-pension-sc/validator-retirement-pension-sc.component';
import { ValidatorStopBenefitScComponent } from './components/validator-stop-benefit-sc/validator-stop-benefit-sc.component';
import { WomenLumpsumScComponent } from './components/women-lumpsum-sc/women-lumpsum-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'approve-saned',
        component: ValidatorSanedBenefitScComponent,
        data: {
          breadcrumb: 'BENEFITS.REQUEST-SANED-HEADING'
        }
      },
      {
        path: 'approve-women-lumpsum',
        component: WomenLumpsumScComponent,
        data: {
          breadcrumb: 'BENEFITS.REQ-WOMAN-LUMPSUM-BENEFIT'
        }
      },
      {
        path: 'validator-retirement-pension',
        component: ValidatorRetirementPensionScComponent
      },
      {
        path: 'validator-retirement-lumpsum',
        component: ValidatorRetirementLumpsumScComponent
      },
      {
        path: 'validate-heir-registeration',
        component: HeirRegisterScComponent,
        data: {
          breadcrumb: 'BENEFITS.REGISTER-HEIR-HEADING'
        }
      },
      {
        path: 'approve-return-lumpsum',
        component: ValidatorReturnLumpsumScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'approve-imprisonment-modify',
        component: ValidatorImprisonmentModifyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'benefit-recalculate',
        component: ValidatorBenefitRecalculationScComponent
      },
      {
        path: 'benefit-type-edit',
        component: BenefitTypeModifyScComponent
      },
      {
        path: 'recalculate-rejoin',
        component: RecalculationRejoiningScComponent
      },
      { path: 'benefit-type', component: BenefitTypeScComponent },
      { path: 'saned-benefit', component: ValidatorSanedCancellationScComponent },
      {
        path: 'modify-benefit-payment',
        component: ModifyBenefitPaymentDetailsScComponent,
        data: {
          breadcrumb: 'BENEFITS.REQUEST-HEIR-BENEFIT'
        }
      },
      {
        path: 'hold-benefit-payment',
        component: ValidatorHoldBenefitScComponent
        // data: {
        //   breadcrumb: 'BENEFITS.HOLD-RETIREMENT-PENSION'
        // }
      },
      {
        path: 'approve-stop-benefit',
        component: ValidatorStopBenefitScComponent
        // data: {
        //   breadcrumb: 'BENEFITS.REQUEST-HEIR-BENEFIT'
        // }
      },
      {
        path: 'approve-restart-benefit',
        component: ValidatorRestartBenefitScComponent
        // data: {
        //   breadcrumb: 'BENEFITS.REQUEST-HEIR-BENEFIT'
        // }
      },
      {
        path: 'modify-commitment',
        component: ValidatorModifyCommitmentScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      },
      {
        path: 'engagement-change',
        component: BenefitRecalculationScComponent
      },
      {
        path: 'heir-recalculation',
        component: HeirRecalculationScComponent
      },
      {
        path: 'disability-assessment',
        component: ValidatorDisabilityAssessmentScComponent
      },
      {
        path: 'request-funeral-grant',
        component: ValidatorFuneralGrantScComponent,
        data: {
          breadcrumb: 'BENEFITS.REQUEST-FUNERAL-GRANT'
        }
      },
      {
        path: 'suspend-saned',
        component: ValidatorSuspendSanedScComponent,
        data: {
          breadcrumb: 'BENEFITS.SUSPEND-UNEMPLOYMENT-INSURANCE-SANED'
        }
      },
      {
        path: 'validator-direct-payment',
        component: ValidatorDirectPaymentScComponent,
        data: {
          breadcrumb: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
