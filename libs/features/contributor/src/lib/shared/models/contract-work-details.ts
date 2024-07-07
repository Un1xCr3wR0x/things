/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class ContractWorkDetails {
  workingDays: number = undefined;
  workingHrs: number = undefined;
  workingHoursStandard: BilingualText = new BilingualText();
  annualLeaveInDays: number = undefined;
  probationPeriodInDays: number = undefined;
  jobTitle: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  transportationAllowance: number = undefined;
  noticePeriod: number = undefined;
  annualLeaveStandard: BilingualText = new BilingualText();
  workDomain: string;
}
