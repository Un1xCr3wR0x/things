/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { VicDashboardScComponent } from './vic-dashboard-sc/vic-dashboard-sc.component';
import { VicBillBalanceDcComponent } from './vic-bill-balance-dc/vic-bill-balance-dc.component';
import { ContributortSearchDcComponent } from './contributor-search-dc/contributor-search-dc.component';
import { VicBillDetailsDcComponent } from './vic-bill-details-dc/vic-bill-details-dc.component';
import { VicDueDateWidgetDcComponent } from './vic-due-date-widget-dc/vic-due-date-widget-dc.component';
import { VicAvailableCreditBreakupDcComponent } from './vic-available-credit-breakup-dc/vic-available-credit-breakup-dc.component';
import { VicLateFeesBreakupDcComponent } from './vic-late-fees-breakup-dc/vic-late-fees-breakup-dc.component';

export const VIC_DASHBOARD_COMPONENTS = [
  VicDashboardScComponent,
  VicBillBalanceDcComponent,
  VicBillDetailsDcComponent,
  ContributortSearchDcComponent,
  VicDueDateWidgetDcComponent,
  VicAvailableCreditBreakupDcComponent,
  VicLateFeesBreakupDcComponent
];

export * from './vic-dashboard-sc/vic-dashboard-sc.component';
export * from './vic-bill-balance-dc/vic-bill-balance-dc.component';
export * from './contributor-search-dc/contributor-search-dc.component';
export * from './vic-bill-details-dc/vic-bill-details-dc.component';
export * from './vic-due-date-widget-dc/vic-due-date-widget-dc.component';
export * from './vic-available-credit-breakup-dc/vic-available-credit-breakup-dc.component';
export * from './vic-late-fees-breakup-dc/vic-late-fees-breakup-dc.component';
