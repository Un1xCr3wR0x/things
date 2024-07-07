/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Transaction } from '@gosi-ui/core';

export interface TransactionHistoryResponse {
  listOfTransactionDetails: Transaction[];
  totalRecords: number;
}
