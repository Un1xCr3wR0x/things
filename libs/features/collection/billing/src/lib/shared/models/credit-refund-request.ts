/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { CreditBalanceDetails } from './credit-balance-details';

export class CreditRefundRequest {
  comments: string = undefined;
  amount: number = undefined;
  registrationNo?: number = undefined;
  creditAccountDetail: CreditBalanceDetails;
  paymentMode?: string = undefined;
  iban: string = undefined;
  bankName: BilingualText = new BilingualText();
  uuid: string = undefined;
  name?: BilingualText = new BilingualText();
  status?: BilingualText = new BilingualText();
  retained?: boolean;
  fromJsonToObject(json) {
    Object.keys(new CreditRefundRequest()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
