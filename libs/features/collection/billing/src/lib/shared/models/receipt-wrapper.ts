/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ReceiptDetails } from './receipt-details';

export class ReceiptWrapper {
  noOfRecords: number = undefined;
  receiptDetailDto: ReceiptDetails[];
  total: number = undefined;
  totalNoOfRecords?: number = undefined;
}
