/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class CreditBalanceDetails {
  accountNumber: string = undefined;
  totalCreditBalance: number = undefined;
  retainedBalance: number = undefined;
  transferableBalance: number = undefined;
  totalDebitBalance: number = undefined;
  eligibleForRefund?: boolean;
  currentCreditBalance?: number = undefined;
}
