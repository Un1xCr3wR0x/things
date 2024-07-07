/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export class PreviousPenalityWavier {
  approvalDate: GosiCalendar = new GosiCalendar();
  penaltyWaiverType: string = undefined;
  waivedPenaltyAmount: number = undefined;
  waivedPenaltyPercentage: number = undefined;
}
