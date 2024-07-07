/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { INDIVIDUAL_MODIFY_ENGAGEMENT_COMPONENTS } from './individual-modify-engagement';
import { ModifyDetailsTableDcComponent } from './modify-details-table-dc/modify-details-table-dc.component';
import { ModifyViolationRequestScComponent } from './modify-violation-request-sc/modify-violation-request-sc.component';
import { ValidatorEInspectionScComponent } from './validator-e-inspection-sc/validator-e-inspection-sc.component';

export const MANAGE_COMPLIANCE_COMPONENTS = [
  ValidatorEInspectionScComponent,
  ModifyDetailsTableDcComponent,
  ModifyViolationRequestScComponent,
  INDIVIDUAL_MODIFY_ENGAGEMENT_COMPONENTS
];

export { ModifyDetailsTableDcComponent } from './modify-details-table-dc/modify-details-table-dc.component';
export { ModifyViolationRequestScComponent } from './modify-violation-request-sc/modify-violation-request-sc.component';
export { ValidatorEInspectionScComponent } from './validator-e-inspection-sc/validator-e-inspection-sc.component';
