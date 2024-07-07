/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class FlagRequest {
  endDate: GosiCalendar = new GosiCalendar();
  justification: string;
  navigationIndicator: number = undefined;
  transactionId: number = undefined;
  comments: string;
  type?: BilingualText;
  reason?: BilingualText;
  startDate?: GosiCalendar;
}
