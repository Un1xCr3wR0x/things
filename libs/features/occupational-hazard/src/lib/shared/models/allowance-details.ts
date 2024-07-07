/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Allowance } from './allowance-wrapper';

export class AllowanceWrapper {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  totalAllowance: number = undefined;
  totalAmount: number = undefined;
  ohType: number = undefined;
  hasPendingModifyPayeeRequest?: boolean;
  claimItem?: Allowance[];
  ohDate: GosiCalendar = new GosiCalendar();
  totalAllowanceForAdmin: number = undefined;
  noOfDays: number = undefined;
  allowancePayee: number = undefined;
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  paymentMethod: BilingualText = new BilingualText();
  transactionMessage: BilingualText = new BilingualText();
  allowances: Allowance[];
  totalCount: number = undefined;
  invalidWage: boolean;
}
