/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class AllowancePayee {
  allowancePayee: number = undefined;
  applicablePayee: BilingualText[];
  injuryDate: GosiCalendar = new GosiCalendar();
  ohType: number = undefined;
  ohDate: GosiCalendar = new GosiCalendar();
  injuryNo: number = undefined;
}
