/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from "@gosi-ui/core";

export class BulkReassignHistory {
  ID: number;
  transactionTraceId: string;
  sourceUserId: string;
  targetUserId: string;
  status: BilingualText;
  // comment: string;
  date: Date;
  reassignedTransactionHistoryList?: BulkReassignHistory[];
}
