/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EngagementPeriodViewDcComponent } from './engagement-period-view-dc/engagement-period-view-dc.component';
import { PersonalDetailsDcComponent } from './personal-details-dc/personal-details-dc.component';
import { ValidateAddContributorScComponent } from './validate-add-contributor-sc/validate-add-contributor-sc.component';
import { EngagementDetailsViewDcComponent } from './engagement-details-view-dc/engagement-details-view-dc.component';

export const ADD_CONTRIBUTOR_COMPONENTS = [
  EngagementDetailsViewDcComponent,
  EngagementPeriodViewDcComponent,
  PersonalDetailsDcComponent,
  ValidateAddContributorScComponent
];

export * from './validate-add-contributor-sc/validate-add-contributor-sc.component';
export * from './engagement-period-view-dc/engagement-period-view-dc.component';
export * from './personal-details-dc/personal-details-dc.component';
export * from './engagement-details-view-dc/engagement-details-view-dc.component';
