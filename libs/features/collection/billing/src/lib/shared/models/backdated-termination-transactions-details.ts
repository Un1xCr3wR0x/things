/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TerminatedContributionsDetails } from './terninated-contributions-details';

export class BackdatedTerminationTransactionsDetails {
  terminatedContributions: TerminatedContributionsDetails[] = [];
  totalRefundableAmount: number = undefined;
  creditBalance?: number = undefined;
  creditBalanceOnSubmit?: number = undefined;
  transferMode?: string = undefined;
  eligibleForRefund: boolean = undefined;
}
