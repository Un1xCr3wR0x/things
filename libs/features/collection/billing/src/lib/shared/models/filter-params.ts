/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ReceiptFilter } from './receipt-filter';
import { Page } from './page';

export class FilterParams {
  receiptFilter: ReceiptFilter = new ReceiptFilter();
  parentReceiptNo: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new ReceiptFilter()).forEach(key => {
      if (key in json) {
        if (key === 'receiptfilter') {
          this[key] = new ReceiptFilter().fromJsonToObject(json[key]);
        }
      } else if (key === 'page') {
        this[key] = new Page().fromJsonToObject(json[key]);
      } else {
        this[key] = json[key];
      }
    });
    return this;
  }
}
