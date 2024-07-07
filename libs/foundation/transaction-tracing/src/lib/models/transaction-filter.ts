/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class TransactionFilter {
  channel: BilingualText[] = [];
  status: BilingualText[] = [];
  lastActionDate: Date = undefined;
  initiatedFrom: Date = undefined;
  initiatedTo: Date = undefined;
  txnType: BilingualText[] = [];
}
