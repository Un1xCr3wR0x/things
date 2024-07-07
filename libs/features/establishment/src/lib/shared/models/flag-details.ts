/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class FlagDetails {
  creationType: BilingualText;
  flagType: BilingualText;
  flagReason: BilingualText;
  justification: string;
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  status: string;
  referenceNo: number = undefined;
  initiatedBy: BilingualText = undefined;
  initiatedRole: BilingualText = undefined;
  flagId?: number;
  inWorkflow?: boolean;
  workflowMessage?: BilingualText;
  oldFlagEndDate?: GosiCalendar = new GosiCalendar();
  oldFlagJustification?: string;
}
