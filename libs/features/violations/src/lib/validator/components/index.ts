/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { INCORRECT_TERMINATION_COMPONENTS } from './incorrect-termination';
import { VIOLATION_VALIDATOR_SHARED_COMPONENTS } from './shared';
import { CANCEL_ENGAGEMENT_COMPONENT } from './cancel-engagement';
import { ADD_NEW_ENGAGEMENT_COMPONENT } from './add-new-engagement';
import { MODIFY_JOINING_DATE } from './modify-joining-date';
import { INCORRECT_WAGE_COMPONENTS } from './incorrect-wage';
import { MODIFY_TERMINATION_DATE_COMPONENTS } from './modify-termination-date';
import { CANCEL_VIOLATIONS_COMPONENTS } from './cancel-violations';
import { MODIFY_VIOLATIONS_COMPONENTS } from './modify-violations';
import { REPORT_VIOLATION_COMPONENTS } from './report-violation';
import { WRONG_BENEFITS_COMPONENT } from './wrong-benefits';
import { VIOLATING_PROVISIONS_COMPONENT } from './violating-provisions';
import { VALIDATOR_INTERNAL_APPEAL_VIOLATION_COMPONENTS } from './appeal-on-violation';
import { VALIDATOR_EXTERNAL_APPEAL_VIOLATION_COMPONENTS } from './appeal-on-violation/appeal-violation-public';
import { REPORT_INJURY_VIOLATION } from './report-injury-violation';

export const VIOLATION_VALIDATOR_COMPONENTS = [
  INCORRECT_TERMINATION_COMPONENTS,
  VIOLATION_VALIDATOR_SHARED_COMPONENTS,
  CANCEL_ENGAGEMENT_COMPONENT,
  ADD_NEW_ENGAGEMENT_COMPONENT,
  MODIFY_JOINING_DATE,
  INCORRECT_WAGE_COMPONENTS,
  MODIFY_TERMINATION_DATE_COMPONENTS,
  CANCEL_VIOLATIONS_COMPONENTS,
  MODIFY_VIOLATIONS_COMPONENTS,
  REPORT_VIOLATION_COMPONENTS,
  WRONG_BENEFITS_COMPONENT,
  VIOLATING_PROVISIONS_COMPONENT,
  VALIDATOR_EXTERNAL_APPEAL_VIOLATION_COMPONENTS,
  VALIDATOR_INTERNAL_APPEAL_VIOLATION_COMPONENTS,
  REPORT_INJURY_VIOLATION
];

export * from './incorrect-termination';
export * from './cancel-engagement';
export * from './add-new-engagement';
export * from './incorrect-wage';
export * from './shared';
export * from './modify-joining-date';
export * from './modify-termination-date';
export * from './cancel-violations';
export * from './modify-violations';
export * from './report-violation';
export * from './wrong-benefits';
export * from './violating-provisions';
export * from './appeal-on-violation/appeal-violation-public';
export * from './appeal-on-violation';
export * from './report-injury-violation';
