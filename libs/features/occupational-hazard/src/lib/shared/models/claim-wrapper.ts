/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { ClaimDetail } from './claim-details';

export class ClaimWrapper {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  totalAllowance: number = undefined;
  totalAmount: number = undefined;
  ohType: number = undefined;
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  claimDetails: ClaimDetail[];
  ohDate: GosiCalendar = new GosiCalendar();
  totalAllowanceForAdmin: number = undefined;
  noOfDays: number = undefined;
  tpaCode?: string;
  allowancePayee: number = undefined;
  transactionMessage: BilingualText = new BilingualText();
  isDisabled: boolean = undefined;
  injuryNo: number;
}
