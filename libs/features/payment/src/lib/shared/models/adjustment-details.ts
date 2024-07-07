/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Adjustment } from './adjustment';
import { PersonAdjustment } from './person-adjustment';
import { BilingualText } from '@gosi-ui/core';

export class AdjustmentDetails {
  adjustments: Adjustment[];
  person: PersonAdjustment;
  payAdjustmentEligible?: boolean;
  debit?: boolean;
  netAdjustmentAmount?: number;
  netMonthlyDeductionAmount?: number;
  netGosiAdjustmentAmount?: number;
  netTpaAdjustmentAmount?: number;
  monthlyTpaAdjustmentAmount?: number;
  newMonthlyDeductionAmount?: number;
  gosiEligibilityInfoMsg?: BilingualText[];
  infoMessages?: Array<BilingualText>;
  transactionDetails?: string;
}
