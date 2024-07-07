/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CalculationWrapper } from './calculation-wrapper';
import { CompanionDetails } from './companion-details';
import { DateFormat } from './date';
import { PayeeDetails } from './payee-details';

export class Allowance {
  id: number = undefined;
  icon?: string;
  showBox?: boolean;
  isRejected = false;
  isDisabled?: boolean = undefined;
  conveyanceCapApplied?: boolean = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  allowanceType: BilingualText = new BilingualText();
  type: BilingualText = new BilingualText();
  treatmentType: BilingualText = new BilingualText();
  recoveryMethod: BilingualText = new BilingualText();
  reissue?: boolean = undefined;
  totalAllowance: number = undefined;
  injuryIdList?: Array<number>;
  totalAmount: number = undefined;
  amount: number = undefined;
  accountNumber: number = undefined;
  actualPaymentStatus: BilingualText = new BilingualText();
  recoveryAppliedOn?: BilingualText = new BilingualText();
  paymentStatus: BilingualText = new BilingualText();
  paymentMethod: BilingualText = new BilingualText();
  paymentDate: GosiCalendar = new GosiCalendar();
  differenceInDays: number = undefined;
  claimId: number = undefined;
  claimsPayee: BilingualText = new BilingualText();
  allowancePayee: number;
  payableTo: string;
  contributorWage: string = undefined;
  calculationWrapper?: CalculationWrapper;
  transactionId?: number;
  companionDetails?: CompanionDetails;
  benefitStartDate?: GosiCalendar = new GosiCalendar();
  benefitEndDate?: GosiCalendar = new GosiCalendar();
  payeeDetails: PayeeDetails;
  simisAllowance: boolean;
  day?: DateFormat[] = [];
  constructor(day: DateFormat[]) {
    this.day = day;
  }
}
