/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ActiveFlagsDcComponent } from './active-flags-dc/active-flags-dc.component';
import { AddFlagScComponent } from './add-flag-sc/add-flag-sc.component';
import { FlagDetailsDcComponent } from './flag-details-dc/flag-details-dc.component';
import { ViewFlagDetailsScComponent } from './view-flag-details-sc/view-flag-details-sc.component';
import { FlagHistoryDcComponent } from './flag-history-dc/flag-history-dc.component';
import { ModifyFlagScComponent } from './modify-flag-sc/modify-flag-sc.component';
import { FlagFilterDcComponent } from './flag-filter-dc/flag-filter-dc.component';

export const FLAG_EST_COMPONENTS = [
  ViewFlagDetailsScComponent,
  AddFlagScComponent,
  FlagDetailsDcComponent,
  ActiveFlagsDcComponent,
  FlagHistoryDcComponent,
  ModifyFlagScComponent,
  FlagFilterDcComponent
];

export * from './active-flags-dc/active-flags-dc.component';
export * from './add-flag-sc/add-flag-sc.component';
export * from './flag-details-dc/flag-details-dc.component';
export * from './view-flag-details-sc/view-flag-details-sc.component';
export * from './flag-history-dc/flag-history-dc.component';
export * from './modify-flag-sc/modify-flag-sc.component';
export * from './flag-filter-dc/flag-filter-dc.component';
