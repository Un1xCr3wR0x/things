/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class InstallmentScheduleDetails {
  sequence: number = undefined;
  month: BilingualText = new BilingualText();
  date: Date = new Date();
  year: number = undefined;
  amount: number = undefined;
}
