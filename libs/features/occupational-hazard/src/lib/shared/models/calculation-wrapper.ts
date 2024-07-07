/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AllowanceBreakUp } from './allowance-breakup';
import { PaymentDetails } from './payment-details';

export class CalculationWrapper {
  allowanceBreakup: AllowanceBreakUp;
  paymentDetails: PaymentDetails;
  transactionMessage: BilingualText;
  benefitStartDate?: GosiCalendar = new GosiCalendar();
  benefitEndDate?: GosiCalendar = new GosiCalendar();
}
