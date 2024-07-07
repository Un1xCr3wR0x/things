/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { PaymentDetail } from './payment-detail';
import { GosiCalendar } from '@gosi-ui/core';

export class TransferDetail {
  paymentDetails: PaymentDetail[];
  transactionDate: GosiCalendar = new GosiCalendar();
}
