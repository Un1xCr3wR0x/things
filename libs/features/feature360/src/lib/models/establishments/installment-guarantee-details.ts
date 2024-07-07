/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class InstallmentGuaranteeDetails {
  category: BilingualText = new BilingualText();
  endDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  guaranteeAmount: number = undefined;
  guaranteeName: BilingualText = new BilingualText();
  guaranteePercentage: number = undefined;
  guarantorId: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
}
