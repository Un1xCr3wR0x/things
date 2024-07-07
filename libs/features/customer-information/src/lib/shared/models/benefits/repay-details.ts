/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class RepayDetails {
  adjustmentAmount: number;
  adjustmentId: number;
  balanceAmount: number;
  benefitRequestDate: GosiCalendar;
  benefitType: BilingualText;
  paidAmount: number;
}
