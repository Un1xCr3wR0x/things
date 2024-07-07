/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { TerminatedContributionsDetails } from './terninated-contributions-details';

export class TerminationTransactionsDetails {
  terminatedContributions: TerminatedContributionsDetails[] = [];
  totalRefundableAmount: number = undefined;
  creditBalance?: number = undefined;
  creditBalanceOnSubmit?: number = undefined;
  iban: string = undefined;
  transferMode?: BilingualText = new BilingualText();
}
