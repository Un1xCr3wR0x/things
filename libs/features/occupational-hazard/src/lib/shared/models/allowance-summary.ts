import { AuditAllowance } from './audit-allowance';
import { AllowanceDate } from './allowance-date';
import { BilingualText } from '@gosi-ui/core';
import { ReceiveClarification } from './receive-clarification';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AllowanceSummary {
  caseId?: number;
  injuryNo?: number;
  registrationNo?: number;
  socialInsuranceNo?: number;
  isViewed?: boolean;
  auditDetail?: AuditAllowance[];
  totalAllowances: number;
  newAllowances?: number;
  ohType?: string;
  treatmentPeriod?: AllowanceDate[];
  cchiNo?: [];
  providerName?: BilingualText[];
  workItemReadStatus?: boolean;
  receiveClarification?: ReceiveClarification[] = [];
  injuryId?: number;
  contributorName?: string;
  ninIqama?: number;
}
