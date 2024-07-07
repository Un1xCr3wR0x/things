import { BilingualText } from '@gosi-ui/core';
import { AllowanceDate } from './allowance-date';
import { AllowancePeriod } from './allowance-period';
import { ClaimDetailsSummary } from './claim-details-summary';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AllowanceAuditSummary {
  allowanceDates: AllowanceDate;
  allowancePeriod: AllowancePeriod[];
  auditReason: BilingualText = new BilingualText();
  comments: string;
  amount: number;
  claimDetails: ClaimDetailsSummary[];
}
