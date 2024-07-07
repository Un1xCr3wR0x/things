/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CimRoutesEnum } from './cim-routes-enum';
import { MaxLength } from './max-length';
import { ContributionBreakupColorEnum } from './contribution-breakup-color-enum';
import { ContributionCategory } from './contribution-category';
import { TimelineColourEnum } from './timeline-colour-enum';
export const MANAGE_PERSON_ENUMS = [
  CimRoutesEnum,
  MaxLength,
  ContributionBreakupColorEnum,
  ContributionCategory,
  TimelineColourEnum
];

export * from './cim-routes-enum';
export * from './max-length';
export * from './contribution-breakup-color-enum';
export * from './contribution-category';
export * from './documents';
export * from './transaction-id';
export * from './aggregated-types';
export * from './engagement-types-enums';
export * from './pension-reform-eligibility';
export * from './timeline-colour-enum';
export * from './sms-notification-type-enum';
