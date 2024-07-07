/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { CreditBalanceDetails } from './credit-balance-details';

export class CreditRefundDetails {
  billBatchIndicator: boolean;
  requestedAmount: number = undefined;
  approvedAmount: number = undefined;
  registrationNo?: number = undefined;
  creditAccountDetail: CreditBalanceDetails;
  paymentMode?: BilingualText = new BilingualText();
  iban: string = undefined;
  name?: BilingualText = new BilingualText();
  status?: BilingualText = new BilingualText();
  currentAccountDetail: CreditBalanceDetails;
  creditRetainIndicator?: BilingualText = new BilingualText();
  haveActiveCancellationRequest?: boolean;

  fromJsonToObject(json) {
    Object.keys(new CreditRefundDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
