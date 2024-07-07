import { BilingualText, TransactionFeedback } from '@gosi-ui/core';
import { BalanceAmount } from './balance-amount';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TerminateResponse extends TransactionFeedback {
  // blacklisted:boolean;
  activeFlags: number;
  pendingTransactions: number;
  debit: boolean;
  hasActiveContributors: boolean;
  hasProactiveContributors: boolean;
  balance: BalanceAmount;
  numberOfContributors: number;
  paymentType: BilingualText;
  hasActiveBranches: boolean;
}
