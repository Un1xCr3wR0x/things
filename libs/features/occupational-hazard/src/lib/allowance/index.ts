/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AllowanceDcComponent } from './allowance-dc.component';
import { AllowanceDetailsScComponent } from './allowance-details-sc/allowance-details-sc.component';
import { AllowanceDetailsTimelineDcComponent } from './allowance-details-timeline-dc/allowance-details-timeline-dc.component';
import { AllowanceDetailsTableDcComponent } from './allowance-details-table-dc/allowance-details-table-dc.component';

export const ALLOWANCE_COMPONENTS = [
  AllowanceDcComponent,
  AllowanceDetailsScComponent,
  AllowanceDetailsTimelineDcComponent,
  AllowanceDetailsTableDcComponent
];

export * from './allowance-dc.component';
export * from './allowance-details-sc/allowance-details-sc.component';
export * from './allowance-details-timeline-dc/allowance-details-timeline-dc.component';
export * from './allowance-details-table-dc/allowance-details-table-dc.component';
