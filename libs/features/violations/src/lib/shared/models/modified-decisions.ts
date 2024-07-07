import { GosiCalendar, BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ModifiedDecisions {
  dateOfModification: GosiCalendar = new GosiCalendar();
  modificationTransactionId: number = undefined;
  modifiedBy: string;
  employeeId: string;
  reasonForModification: BilingualText = new BilingualText();
  role: BilingualText;
  comments: string;
  isCancelled: boolean;
}
