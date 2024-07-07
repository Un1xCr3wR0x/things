/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AllowancePeriodOh } from './allowance-period-oh';

export class AllowanceBreakUpOh {
  ohClaimId: number;
  transactionTraceId: number;
  allowanceType: BilingualText = new BilingualText();
  allowancePeriod: AllowancePeriodOh;
  noOfDays: number;
  amount: number;
  allowanceAuditStatus: string;
  tpaStatus: string;
  isDisabled?: boolean
}
