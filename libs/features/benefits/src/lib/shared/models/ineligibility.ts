/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Ineligibility {
  heirPersonId: number;
  period: IneligibilityPeriod[] = [];
  hasEligiblePeriod: boolean;
}

export class IneligibilityPeriod {
  endDate: GosiCalendar;
  reasons: BilingualText;
  startDate: GosiCalendar;
}
