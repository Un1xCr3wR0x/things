/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class HoldResumeDetails {
  type: number = undefined;
  requestType: number = undefined;
  injuryNo: number = undefined;
  requestDate: GosiCalendar = new GosiCalendar();
  reason: BilingualText = new BilingualText();
  ohDate: GosiCalendar = new GosiCalendar();
  holdFromDate: GosiCalendar = new GosiCalendar();
  status: number = undefined;
}
