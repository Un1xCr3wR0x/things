import { GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectAllowanceDetails {
  claimId: number;
  rejectedPeriod: {
    endDate: GosiCalendar;
    startDate: GosiCalendar;
  };
  visits: number;
}
