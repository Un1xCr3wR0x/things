/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RecipientAmountDetails } from './recipient-amount-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CreditBalanceDetails } from './credit-balance-details';

export class CreditManagmentRequest {
  billBatchIndicator: boolean;
  comments: string = undefined;
  recipientDetail: RecipientAmountDetails[];
  creditAccountDetail: CreditBalanceDetails;
  currentAccountDetail: CreditBalanceDetails;
  uuid: string = undefined;
  transferMode: BilingualText = new BilingualText();
  referenceNo?: number = undefined;
  haveActiveCancellationRequest?: boolean;
  initiatedDate: GosiCalendar = new GosiCalendar();
  fromJsonToObject(json) {
    Object.keys(new CreditManagmentRequest()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
