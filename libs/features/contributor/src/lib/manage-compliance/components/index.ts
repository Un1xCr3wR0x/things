/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ComplianceViewDcComponent } from './compliance-view-dc/compliance-view-dc.component';
import { EInspectionScComponent } from './e-inspection-sc/e-inspection-sc.component';
import { EInspectionWageTableDcComponent } from './e-inspection-wage-table-dc/e-inspection-wage-table-dc.component';

export const MANAGE_COMPLIANCE_COMPONENTS = [
  EInspectionScComponent,
  ComplianceViewDcComponent,
  EInspectionWageTableDcComponent
];

export * from './compliance-view-dc/compliance-view-dc.component';
export * from './e-inspection-sc/e-inspection-sc.component';
export * from './e-inspection-wage-table-dc/e-inspection-wage-table-dc.component';
