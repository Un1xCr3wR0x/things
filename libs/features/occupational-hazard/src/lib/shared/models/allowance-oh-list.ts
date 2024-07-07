/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AllowanceSummary } from './allowance-summary';
import { GosiCalendar } from '@gosi-ui/core';

export class AllowanceOhList {
  auditCases: AllowanceSummary[];
  allowanceAuditCases?: AllowanceSummary[];
  monthOfSubmission: GosiCalendar = new GosiCalendar();
  batchMonth?: GosiCalendar = new GosiCalendar();
  tpaId: number;
  tpaName: string;
  auditStatus?: string;
}
