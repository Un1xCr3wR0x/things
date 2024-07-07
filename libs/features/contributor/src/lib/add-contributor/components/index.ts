/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AddContributorScComponent } from './add-contributor-sc/add-contributor-sc.component';
import { ProactiveScComponent } from './proactive-contributor/proactive-contributor-sc/proactive-sc.component';
import { FileUploadDcComponent } from './file-upload-dc/file-upload-dc.component';
import { EngagementDetailsDcComponent } from './engagement-details-dc/engagement-details-dc.component';
import { EngagementWageAddDcComponent } from './engagement-wage-add-dc/engagement-wage-add-dc.component';
import { EngagementWageHistoryDcComponent } from './engagement-wage-history-dc/engagement-wage-history-dc.component';
import { PERSON_DETAILS_COMPONENTS } from './person-details';
import { EmploymentStatusSwitchDcComponent } from './employment-status-switch-dc/employment-status-switch-dc.component';
import { EngagementPeriodDcComponent } from './engagement-period-dc/engagement-period-dc.component';
import { ContributorConfirmationDcComponent } from './contributor-confirmation-dc/contributor-confirmation-dc.component';
import { ProactivePersonDetailsDcComponent } from './proactive-contributor/proactive-person-details-dc/proactive-person-details-dc.component';
import { ProactiveEngagementDetailsDcComponent } from './proactive-contributor/proactive-engagement-details-dc/proactive-engagement-details-dc.component';
import { FeedbackDcComponent } from './feedback-dc/feedback-dc.component';

export const ADD_CONTRIBUTOR_COMPONENTS = [
  AddContributorScComponent,
  PERSON_DETAILS_COMPONENTS,
  ProactiveScComponent,
  FileUploadDcComponent,
  EngagementDetailsDcComponent,
  EngagementWageAddDcComponent,
  EngagementWageHistoryDcComponent,
  EmploymentStatusSwitchDcComponent,
  ContributorConfirmationDcComponent,
  EngagementPeriodDcComponent,
  ProactivePersonDetailsDcComponent,
  ProactiveEngagementDetailsDcComponent,
  FeedbackDcComponent
];

export * from './add-contributor-sc/add-contributor-sc.component';
export * from './proactive-contributor/proactive-contributor-sc/proactive-sc.component';
export * from './engagement-details-dc/engagement-details-dc.component';
export * from './engagement-wage-add-dc/engagement-wage-add-dc.component';
export * from './engagement-wage-history-dc/engagement-wage-history-dc.component';
export * from './employment-status-switch-dc/employment-status-switch-dc.component';
export * from './contributor-confirmation-dc/contributor-confirmation-dc.component';
export * from './engagement-period-dc/engagement-period-dc.component';
export * from './proactive-contributor/proactive-person-details-dc/proactive-person-details-dc.component';
export * from './proactive-contributor/proactive-engagement-details-dc/proactive-engagement-details-dc.component';
export * from './feedback-dc/feedback-dc.component';
