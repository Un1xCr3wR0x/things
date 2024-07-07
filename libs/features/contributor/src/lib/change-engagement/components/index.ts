/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DocumentSectionDcComponent } from './document-section-dc/document-section-dc.component';
import { EngagementCalendarViewDcComponent } from './engagement-calendar-view-dc/engagement-calendar-view-dc.component';
import { EngagementPeriodDcComponent } from './engagement-period-dc/engagement-period-dc.component';
import { IndividualEngagementScComponent } from './individual-engagement-sc/individual-engagement-sc.component';
import { PeriodDetailsDcComponent } from './period-details-dc/period-details-dc.component';
import { PeriodNavigationDcComponent } from './period-navigation-dc/period-navigation-dc.component';
import { WageBreakupDcComponent } from './wage-breakup-dc/wage-breakup-dc.component';
import { ConfirmationModalDcComponent } from './confirmation-modal-dc/confirmation-modal-dc.component';
import { ModifyCoverageDcComponent } from './modify-coverage-dc/modify-coverage-dc.component';
import { ChangeEngagementIndScComponent } from './change-engagement-ind-sc/change-engagement-ind-sc.component';

export const CHANGE_ENGAGEMENT_COMPONENTS = [
  IndividualEngagementScComponent,
  EngagementPeriodDcComponent,
  PeriodDetailsDcComponent,
  PeriodNavigationDcComponent,
  WageBreakupDcComponent,
  DocumentSectionDcComponent,
  EngagementCalendarViewDcComponent,
  ConfirmationModalDcComponent,
  ModifyCoverageDcComponent,
  ChangeEngagementIndScComponent
];

export * from './document-section-dc/document-section-dc.component';
export * from './engagement-calendar-view-dc/engagement-calendar-view-dc.component';
export * from './engagement-period-dc/engagement-period-dc.component';
export * from './individual-engagement-sc/individual-engagement-sc.component';
export * from './period-details-dc/period-details-dc.component';
export * from './period-navigation-dc/period-navigation-dc.component';
export * from './wage-breakup-dc/wage-breakup-dc.component';
export * from './confirmation-modal-dc/confirmation-modal-dc.component';
export * from './modify-coverage-dc/modify-coverage-dc.component';
export * from './change-engagement-ind-sc/change-engagement-ind-sc.component'