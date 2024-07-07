import { ReceiptDetails } from './receipt-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ItemizedReceiptWrapper {
  receiptDetailDto: ReceiptDetails[] = [];
  total: number = undefined;
  noOfRecords: number = undefined;
}
