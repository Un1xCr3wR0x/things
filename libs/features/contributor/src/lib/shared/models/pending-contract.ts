/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class PendingContract {
  establishmentName: BilingualText = new BilingualText();
  contractType: string = undefined;
  entryDate: GosiCalendar = new GosiCalendar();
  autoCancellationDate: GosiCalendar = new GosiCalendar();
  referenceNumber: string = undefined;
  daysLeft: number = undefined;
  contractId: number = undefined;
}
