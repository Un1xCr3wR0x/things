/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { InstallmentGuaranteeDetails } from './installment-guarantee-details';
import { InstallmentSchedule } from './installment-schedule';

export class InstallmentSummary {
  status: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  monthlyInstallmentAmount: number = undefined;
  guaranteeDetail: InstallmentGuaranteeDetails[] = [];
  lastInstallmentAmount: number = undefined;
  downPaymentPercentage: number = undefined;
  installmentPeriodInMonths: number = undefined;
  totalContributionDue: number = undefined;
  totalPenaltyDue: number = undefined;
  totalInstallmentAmount: number = undefined;
  totalRejectedOh: number = undefined;
  totalViolation: number = undefined;
  totalDue: number = undefined;
  transactionTraceId: number = undefined;
  downPayment: number = undefined;
  referenceNumber: number = undefined;
  gracePeriod: number = undefined;
  extensionReason: string = undefined;
  extendedGracePeriod: number = undefined;
  schedule: InstallmentSchedule[] = [];
  installmentAmountPaid: number = undefined;
  installmentAmountRemaining: number = undefined;
  nextInstallmentDate: GosiCalendar = new GosiCalendar();
  numberOfMonthsPaid: number = undefined;
  numberOfMonthsRemaining: number = undefined;
  penaltyWaiverEligible: Boolean = false;
  specialGuaranteeType : BilingualText = new BilingualText();
  guaranteeStatus : BilingualText = new BilingualText();
}
