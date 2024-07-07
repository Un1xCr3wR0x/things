import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { RejectedAllowancesList } from './rejected-allowances-list';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectedAllowance {
  transactionId: number;
  rejectionReason: BilingualText = new BilingualText();
  rejectedPeriod: {
    startDate: GosiCalendar;
    endDate: GosiCalendar;
  };
  comments: string;
  rejectionDetails: RejectedAllowancesList[];
  recoveryAppliedOn: BilingualText = new BilingualText();
  rejectedRequestDate: GosiCalendar;
}
