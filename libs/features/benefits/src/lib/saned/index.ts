/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ACTIVE_BENEFITS_LISTING_COMPONENTS } from './active-benefits';
import { SANED_LISTING_COMPONENTS } from './saned-listing';
import { SanedBenefitHistoryScComponent } from './saned-benefit-history-sc/saned-benefit-history-sc.component';
import { SubmitSanedBenefitScComponent } from './submit-saned-benefit-sc/submit-saned-benefit-sc.component';
import { AppealDetailsDcComponent } from './appeal-details-dc/appeal-details-dc.component';
import { AppealTabDcComponent } from './appeal-tab-dc/appeal-tab-dc.component';
import { RaiseAppealScComponent } from './raise-appeal-sc/raise-appeal-sc.component';
import { BenefitEstimationScComponent } from './benefit-estimation-sc/benefit-estimation-sc.component';
import { SuspendSanedBenefitScComponent } from './suspend-saned-benefit-sc/suspend-saned-benefit-sc.component';
import { PensionEstimationScComponent } from './pension-estimation-sc/pension-estimation-sc.component';

export const SANED_COMPONENTS = [
  ACTIVE_BENEFITS_LISTING_COMPONENTS,
  SANED_LISTING_COMPONENTS,
  SanedBenefitHistoryScComponent,
  SubmitSanedBenefitScComponent,
  AppealDetailsDcComponent,
  AppealTabDcComponent,
  RaiseAppealScComponent,
  BenefitEstimationScComponent,
  SuspendSanedBenefitScComponent,
  PensionEstimationScComponent
];

export * from './active-benefits';
export * from './saned-benefit-history-sc/saned-benefit-history-sc.component';
export * from './saned-listing';
export * from './submit-saned-benefit-sc/submit-saned-benefit-sc.component';
export * from './raise-appeal-sc/raise-appeal-sc.component';
export * from './saned-benefit-history-sc/saned-benefit-history-sc.component';
export * from './suspend-saned-benefit-sc/suspend-saned-benefit-sc.component';
export * from './pension-estimation-sc/pension-estimation-sc.component';
