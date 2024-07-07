import { SummaryOh } from './summary-oh';
import { AllowanceBreakUpOh } from './allowance-break-up-oh';
import { AllowancePeriodOh } from './allowance-period-oh';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AllowanceAuditSummaryOh {
  totalAllowancePeriod: AllowancePeriodOh;
  allowanceSummary: SummaryOh[];
  allowanceBreakUp: AllowanceBreakUpOh[];
}
