/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {BilingualText} from "@gosi-ui/core";


export class ItemizedLateFeesBreakUp {
  adjustmentDate: Date;
  description: BilingualText;
  paymentReferenceNo: String;
  receiptNumber: String;
  transactionDate: Date;
  receiptDate: Date;
  receiptMode: BilingualText;
  returnedLateFeesAmount: number
}

