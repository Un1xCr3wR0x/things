/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
export interface HeirBenefitDetails {
  benefitAmount: number;
  identifier: number;
  name: BilingualText;
  payeeType: BilingualText;
  paymentMode: BilingualText;
  relationship: BilingualText;
  lastPaidDate: GosiCalendar;
  status: BilingualText;
  amountBeforeUpdate: number;
  adjustmentAmount?: number;
  marriageGrant: number;
}
