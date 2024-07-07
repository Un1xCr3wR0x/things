import { GosiCalendar, BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PenaltyWaiverRequest {
  comments: string = undefined;
  exceptionReason: BilingualText = undefined;
  gracePeriod: number = undefined;
  extendedGracePeriod: number = undefined;
  extensionReason: string = undefined;
  extensionReasonOthers: string = undefined;
  paymentRequired: boolean;
  waiveOffType: string = undefined;
  waiverEndDate: GosiCalendar = new GosiCalendar();
  waiverStartDate: GosiCalendar = new GosiCalendar();
  waiverPercentage: number = undefined;
  uuid: string = undefined;
}
