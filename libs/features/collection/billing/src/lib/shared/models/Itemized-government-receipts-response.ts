/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ItemizedGovernmentReceiptsResponse {
  totalNoOfRecords: number;
  uploadReceipts: UploadReceiptsList[];
  noOfRecords: number;
}

export class UploadReceiptsList {
  establishmentName: string;
  transactionDate: GosiCalendar;
  amount: number;
  referenceNo: number;
  paymentOrderNumber: number;
  createDate: GosiCalendar;
  status: BilingualText;
  fromJsonToObject(json) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key === 'amount' || key === 'referenceNo' || key === 'paymentOrderNumber') {
          this[key] = Number(json[key]);
        } else {
          this[key] = json[key];
        }
      });
      return this;
    }
  }
}
