import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { RecoveryBreakUp } from './recovery-breakup-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ExpensesDetails {
  id: number = undefined;
  amount: number = undefined;
  type: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  recoveryBreakup: RecoveryBreakUp = new RecoveryBreakUp();
  total: number = undefined;
}
