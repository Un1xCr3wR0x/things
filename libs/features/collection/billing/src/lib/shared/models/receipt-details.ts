/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class ReceiptDetails {
  parentReceiptNo: string = undefined;
  receiptDate: GosiCalendar = new GosiCalendar();
  amountReceived: number = undefined;
  referenceNo: number = undefined;
  receiptStatus: BilingualText = new BilingualText();
  receiptMode: BilingualText = new BilingualText();
  chequeNumber: number = undefined;
  approvalStatus: number = undefined;
  mofIndicator: string = undefined;
}
