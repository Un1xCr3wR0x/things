/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class ItemizedPaymentReceiptDetails {
  receiptDate: GosiCalendar = new GosiCalendar();
  amount: number = undefined;
  receiptNo: number = undefined;
}
