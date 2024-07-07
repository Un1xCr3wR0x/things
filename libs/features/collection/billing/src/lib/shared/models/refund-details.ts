/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class RefundDetails {
  approvedAmount: number = undefined;
  iban: string = undefined;
  paymentType: BilingualText = new BilingualText();
  transactionDate: GosiCalendar = new GosiCalendar();
}
