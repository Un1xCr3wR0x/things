/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class EventDateDetails {
  month: BilingualText = new BilingualText();
  year: number = undefined;
  eventDate: GosiCalendar = new GosiCalendar();
}
