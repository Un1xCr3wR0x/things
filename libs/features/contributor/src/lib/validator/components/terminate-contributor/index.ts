/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ValidateSecondmentStudyleaveScComponent } from './validate-secondment-studyleave-sc/validate-secondment-studyleave-sc.component';
import { ValidateTerminateContributorScComponent } from './validate-terminate-contributor-sc/validate-terminate-contributor-sc.component';
import { ValidateTerminateEngIndScComponent } from './validate-terminate-eng-ind-sc/validate-terminate-eng-ind-sc.component';
import { ViewTerminateDetailsDcComponent } from './view-terminate-details-dc/view-terminate-details-dc.component';
import { ViewTerminateSecondmentDetailsDcComponent } from './view-terminate-secondment-details-dc/view-terminate-secondment-details-dc.component';
import { ViewTerminateStudyleaveDetailsDcComponent } from './view-terminate-studyleave-details-dc/view-terminate-studyleave-details-dc.component';

export const TERMINATE_CONTRIBUTOR_COMPONENTS = [
  ValidateTerminateContributorScComponent,
  ViewTerminateDetailsDcComponent,
  ValidateTerminateEngIndScComponent,
  ViewTerminateSecondmentDetailsDcComponent,
  ViewTerminateStudyleaveDetailsDcComponent,
  ValidateSecondmentStudyleaveScComponent
];

export * from './validate-secondment-studyleave-sc/validate-secondment-studyleave-sc.component';
export * from './validate-terminate-contributor-sc/validate-terminate-contributor-sc.component';
export * from './validate-terminate-eng-ind-sc/validate-terminate-eng-ind-sc.component';
export * from './view-terminate-details-dc/view-terminate-details-dc.component';
export * from './view-terminate-secondment-details-dc/view-terminate-secondment-details-dc.component';
export * from './view-terminate-studyleave-details-dc/view-terminate-studyleave-details-dc.component';
