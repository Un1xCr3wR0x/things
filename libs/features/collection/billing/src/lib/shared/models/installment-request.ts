/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { InstallmentGuaranteeDetails } from './installment-guarantee-details';
import { InstallmentSchedule } from './installment-schedule';

export class InstallmentRequest {
  comments: string;
  downPayment: number = undefined;
  downPaymentPercentage: number = undefined;
  schedule: InstallmentSchedule[] = [];
  endDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  guaranteeDetail: InstallmentGuaranteeDetails[] = [];
  installmentPeriodInMonths: number = undefined;
  lastInstallmentAmount: number = undefined;
  monthlyInstallmentAmount: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  extendedGracePeriod: number = undefined;
  installmentStartMonth: BilingualText = new BilingualText();
  installmentEndMonth: BilingualText = new BilingualText();
  extensionReason: string = undefined;
  gracePeriod: number = undefined;
  totalContributionDue: number = undefined;
  totalDue: number = undefined;
  totalInstallmentAmount: number = undefined;
  totalPenaltyDue: number = undefined;
  totalRejectedOh: number = undefined;
  totalViolation: number = undefined;
  uuid: string = undefined;
  outOfMarket: boolean;
  initiatedDate: GosiCalendar = new GosiCalendar();
  guaranteeStatus: BilingualText;
  guaranteePercentage: number;
  specialGuaranteeType: BilingualText;
}
