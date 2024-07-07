/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanedDcComponent } from './saned-dc.component';
import { SanedListingScComponent } from './saned-listing';
import { SubmitSanedBenefitScComponent } from './submit-saned-benefit-sc/submit-saned-benefit-sc.component';
import { SanedBenefitHistoryScComponent } from './saned-benefit-history-sc/saned-benefit-history-sc.component';
import { SanedPaymentDetailsScComponent } from './saned-payment-details-sc/saned-payment-details-sc.component';
import { RaiseAppealScComponent } from './raise-appeal-sc/raise-appeal-sc.component';
import { BenefitEstimationScComponent } from './benefit-estimation-sc/benefit-estimation-sc.component';
import { SuspendSanedBenefitScComponent } from './suspend-saned-benefit-sc/suspend-saned-benefit-sc.component';
import { PensionEstimationScComponent } from './pension-estimation-sc/pension-estimation-sc.component';
import { AppealAssessmentFormScComponent } from './appeal-assessment-form-sc/appeal-assessment-form-sc.component';
export const routes: Routes = [
  {
    path: '',
    component: SanedDcComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: SanedListingScComponent },
      { path: 'apply', component: SubmitSanedBenefitScComponent },
      { path: 'appeal', component: RaiseAppealScComponent },
      { path: 'appealAssessment', component: AppealAssessmentFormScComponent },
      { path: 'reopen', component: SubmitSanedBenefitScComponent },
      { path: 'sanedbenefithistory', component: SanedBenefitHistoryScComponent },
      { path: 'sanedpaymentdetails', component: SanedPaymentDetailsScComponent },
      {
        path: 'benefitEstimation',
        component: BenefitEstimationScComponent,
        data: {
          breadcrumb: 'ADJUSTMENT.RECOVER-ADJUSTMENTS'
        }
      },
      { path: 'suspend', component: SuspendSanedBenefitScComponent },
      {
        path: 'pensionEstimation',
        component: PensionEstimationScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-ESTIMATOR'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanedRoutingModule {}
