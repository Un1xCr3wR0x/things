/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ReactivateDcComponent } from './reactivate-dc/reactivate-dc.component';
import { ReactivateEngagementDetailsDcComponent } from './reactivate-engagement-details-dc/reactivate-engagement-details-dc.component';
import { ReactivateWageTableDcComponent } from './reactivate-wage-table-dc/reactivate-wage-table-dc.component';
import { ValidatorReactivateEngagementScComponent } from './validator-reactivate-engagement-sc/validator-reactivate-engagement-sc.component';

export const REACTIVATE_ENGAGEMENT_COMPONENTS = [
  ValidatorReactivateEngagementScComponent,
  ReactivateDcComponent,
  ReactivateEngagementDetailsDcComponent,
  ReactivateWageTableDcComponent
];

export * from './reactivate-dc/reactivate-dc.component';
export * from './reactivate-engagement-details-dc/reactivate-engagement-details-dc.component';
export * from './reactivate-wage-table-dc/reactivate-wage-table-dc.component';
export * from './validator-reactivate-engagement-sc/validator-reactivate-engagement-sc.component';
