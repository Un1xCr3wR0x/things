/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorPersonalDetailsDcComponent } from './contributor-personal-details-dc/contributor-personal-details-dc.component';
import { EngagementBasicDetailsDcComponent } from './engagement-basic-details-dc/engagement-basic-details-dc.component';
import { VicPersonalDetailsDcComponent } from './vic-personal-details-dc/vic-personal-details-dc.component';
import { ContributorDetailsDcComponent } from './contributor-details-dc/contributor-details-dc.component'
import { EngagementDetailsDcComponent} from './engagement-details-dc/engagement-detailsRe-dc.component'

export const SHARED_VALIDATOR_COMPONENTS = [
  ContributorPersonalDetailsDcComponent,
  EngagementBasicDetailsDcComponent,
  VicPersonalDetailsDcComponent,
  ContributorDetailsDcComponent,
  EngagementDetailsDcComponent
];

export * from './contributor-personal-details-dc/contributor-personal-details-dc.component';
export * from './engagement-basic-details-dc/engagement-basic-details-dc.component';
export * from './vic-personal-details-dc/vic-personal-details-dc.component';
export * from './contributor-details-dc/contributor-details-dc.component';
export * from './engagement-details-dc/engagement-detailsRe-dc.component';