/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class RecentActivityWrapper {
  title: BilingualText = new BilingualText();
  description: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  createdDate: GosiCalendar = new GosiCalendar();
  date?: string = undefined;
}
