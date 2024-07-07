/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class HoldBenefit {
  reason: BilingualText;
  requestDate: GosiCalendar;
  notes: string;
  referenceNo?: number;
}
