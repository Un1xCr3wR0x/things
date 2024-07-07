import { Transaction } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TransactionSearchResponse {
  totalRecords: number;
  listOfTransactionDetails: Transaction[] = [];
}
