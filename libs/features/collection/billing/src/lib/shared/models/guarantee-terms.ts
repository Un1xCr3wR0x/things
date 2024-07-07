import { AdditionalGuarantee } from './additional-guarantee';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class GuaranteeTerms {
  additionalGuarantee: AdditionalGuarantee = new AdditionalGuarantee();
  downPaymentRequired = false;
  exceptionFromDownPayment = true;
  maxInstallmentPeriodInMonths: number = undefined;
  maxInstallmentPeriodMonthsAfterException: number = undefined;
  minMonthlyInstallmentAmount: number = undefined;
  minimumDueForAllowingInstallment: number = undefined;
  eligibleForIncreasingMaxInstallPeriod = true;
  totalPensionAmount: number = undefined;
}
