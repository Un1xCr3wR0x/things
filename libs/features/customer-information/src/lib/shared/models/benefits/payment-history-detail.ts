/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BenefitPaymentDetails, PaymentsDetail, RepaymentDetails } from '.';

export class PaymentHistoryDetails {
  benefitDetails: BenefitPaymentDetails;
  date: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
  eventType: string;
  payments: PaymentsDetail[];
  reasons: BilingualText[];
  repaymentDetails: RepaymentDetails;
  recalculationDetails?: RecalculationHistoryDetails;
  netAdjustedAmount?: number;
  netAdjustedType?: BilingualText;
  paidAdjustments?: PaidAdjustments[];
}

export class RecalculationHistoryDetails {
  adjustmentType: BilingualText;
  adjustmentAmount: number;
  previousBenefitAmount: number;
  currentBenefitAmount: number;
  eligibilityDate: GosiCalendar;
}
export class PaidAdjustments {
  adjustmentId?: number;
  benefitType?: BilingualText;
  reason?: BilingualText;
  adjustmentType?: BilingualText;
  percentage?: number;
  adjustedAmount?: number;
}
