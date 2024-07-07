/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TransactionResponse {
  totalRecords: number;
  listOfTransactionDetails: TransactionData[] = [];
}

export class TransactionData {
  actionedBy: string;
}
