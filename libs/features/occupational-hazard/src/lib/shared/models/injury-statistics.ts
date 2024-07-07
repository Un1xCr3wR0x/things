/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { PreviousInjury } from './previous-injury';

export class InjuryStatistics {
  injuries: PreviousInjury = new PreviousInjury();
  lastYearInjuryCount: number = undefined;
  previousInjuryDate: GosiCalendar = new GosiCalendar();
  previousInjuryStatus: BilingualText = new BilingualText();
  previousInjuryActualStatus: BilingualText = new BilingualText();
  totalInjuryCount: number = undefined;
}
