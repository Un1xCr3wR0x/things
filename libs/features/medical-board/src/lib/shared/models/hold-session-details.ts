/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
export class HoldSessionDetails {
  id?: number = undefined;
  comments: string = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  holdReason: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
}
