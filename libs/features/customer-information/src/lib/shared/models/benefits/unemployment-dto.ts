/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { PatchPersonBankDetails } from './patch-person-bank-details';
import { EligiblePeriods } from './benefits';

export interface UnemploymentDto {
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  status: BilingualText;
}

export class UiApply {
  bankAccount?: PatchPersonBankDetails;
  referenceNo?: number;
  eligiblePeriod?: EligiblePeriods;
  appealReason?: BilingualText;
  reasonDescription?: string;
  requestDate = new GosiCalendar();
}
