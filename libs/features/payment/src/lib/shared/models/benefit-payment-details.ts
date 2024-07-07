/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BenefitPaymentAdjustment } from './benefit-payment-adjustment';

export class BenefitPaymentDetails {
  adjustedAmount: number;
  adjustmentList: BenefitPaymentAdjustment[];
  benefitType: BilingualText;
  startDate: GosiCalendar;
  status: BilingualText;
  stopDate: GosiCalendar;
}
