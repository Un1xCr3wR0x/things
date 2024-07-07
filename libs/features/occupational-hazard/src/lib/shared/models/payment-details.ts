import { GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PaymentDetails {
  accountNo: string = undefined;
  paymentDate: GosiCalendar = new GosiCalendar();
  paymentMethod: string = undefined;
  transactionId: string = undefined;
  cashedDate?: GosiCalendar = new GosiCalendar();
  chequeNo?: string = undefined;
}
