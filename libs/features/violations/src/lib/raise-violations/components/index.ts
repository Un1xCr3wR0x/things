/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ReportViolationScComponent } from './report-violation-sc/report-violation-sc.component';
import { ReportContributorDetailsDcComponent } from './report-contributor-details-dc/report-contributor-details-dc.component';
import { ReportViolationDetailsDcComponent } from './report-violation-details-dc/report-violation-details-dc.component';
import { AddContributorDcComponent } from './add-contributor-dc/add-contributor-dc.component';
import { EngagementDetailsDcComponent } from './engagement-details-dc/engagement-details-dc.component';
export const RAISE_VIOLATIONS_COMPONENTS = [
  ReportViolationScComponent,
  ReportContributorDetailsDcComponent,
  ReportViolationDetailsDcComponent,
  AddContributorDcComponent,
  EngagementDetailsDcComponent
];

export * from './report-violation-sc/report-violation-sc.component';
export * from './report-contributor-details-dc/report-contributor-details-dc.component';
export * from './report-violation-details-dc/report-violation-details-dc.component';
export * from './add-contributor-dc/add-contributor-dc.component';
export * from './engagement-details-dc/engagement-details-dc.component';
