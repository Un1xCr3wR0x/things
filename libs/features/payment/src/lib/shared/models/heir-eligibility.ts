/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class HeirEligibility {
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  eventName: BilingualText;
  status: BilingualText;
  statusDate: GosiCalendar;
  valid: boolean;
}
