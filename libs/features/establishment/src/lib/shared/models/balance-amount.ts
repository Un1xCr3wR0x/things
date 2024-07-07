/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BalanceAmount {
  /*Holds total amount */
  outStandingAmount = 0;
  unBilledViolationAmount = 0;
  unBilledRejectedOHAmount = 0;
  unBilledContributions = 0;
  unBilledAdjustments = 0;
  unBilledPenalty = 0;
  unBilledAdjustmentsPenalty = 0;
  unBilledViolationAdjustments = 0;
  creditBalance = 0;
  /**holds the last billed amount */
  billedAmount = 0;
}
