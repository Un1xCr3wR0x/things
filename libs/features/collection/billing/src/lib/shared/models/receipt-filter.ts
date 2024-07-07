import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { FilterDate } from './filter-date';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ReceiptFilter {
  approvalStatus: BilingualText[] = [];
  endDate: GosiCalendar = new GosiCalendar();
  receiptDate: FilterDate = new FilterDate();
  maxAmount: number = undefined;
  minAmount: number = undefined;
  receiptMode: BilingualText[] = [];
  startDate: GosiCalendar = new GosiCalendar();
  status: BilingualText[] = [];
  referenceNumber: number;
  chequeNumber: number;
  registrationNo: number;

  fromJsonToObject(json) {
    Object.keys(new ReceiptFilter()).forEach(key => {
      this[key] = json[key];
    });
    return this;
  }
}
