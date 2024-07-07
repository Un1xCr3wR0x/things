/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RefundDetails } from './refund-details';

export class ItemizedCreditRefund {
  numberOfRecords: number = undefined;
  refundDetails: RefundDetails[];
  totalAmount: number = undefined;
}