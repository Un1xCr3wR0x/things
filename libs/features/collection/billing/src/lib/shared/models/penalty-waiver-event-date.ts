import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PenaltyWaiverEventDate {
  actualEventDate: GosiCalendar = new GosiCalendar();
  newEventDate: GosiCalendar = new GosiCalendar();
  month: BilingualText = new BilingualText();
  year: number;
}
