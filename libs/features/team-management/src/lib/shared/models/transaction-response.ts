/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TeamTransaction } from './team-transaction';

export interface TransactionResponse {
  listOfTransactions: TeamTransaction[];
  totalRecords: number;
  highPriorityTransactions: number;
  mediumPriorityTransactions: number;
  lowPriorityTransactions: number;
  pendingTransactions: number;
  olaExceededTransactions: number;
  allTransactions: number;
  onHoldTransactions: number;
  returnedTransactions: number;
  rejectedTransactions: number;
  successTransactions: number;
}
