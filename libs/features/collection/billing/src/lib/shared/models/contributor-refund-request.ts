/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributorAmountDetails } from './contributor-amount-details';

export class ContributorRefundRequest {
  paymentMode: string = undefined;
  recipientDetail: ContributorAmountDetails[];
  comments?: number = undefined;
  iban: string = undefined;
  uuid: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new ContributorRefundRequest()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
