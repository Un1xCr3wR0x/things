/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EMPLOYEE_VALIDATOR_DIALOGS } from './dialogs';
import { EmployeeAppealScComponent } from './employee-validate-appeal-sc/employee-validate-appeal-sc.component';
import { RequestSummaryComponent } from './request-summary/request-summary.component';
import { FIRST_LEVEL_APPEAL_FORMS } from './workflows-wrapper';
import { AppealsWorkflowsComponent } from './workflows-wrapper/workflows-wrapper.component';

export const EMPLOYEE_VALIDATOR_APPEAL_COMPONENTS = [
  EmployeeAppealScComponent,
  RequestSummaryComponent,
  AppealsWorkflowsComponent,
  FIRST_LEVEL_APPEAL_FORMS,
  EMPLOYEE_VALIDATOR_DIALOGS
];

export * from './employee-validate-appeal-sc/employee-validate-appeal-sc.component';
export * from './workflows-wrapper/workflows-wrapper.component';
export * from './request-summary/request-summary.component';
export * from './dialogs/index';
