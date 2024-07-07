/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, Name } from '@gosi-ui/core';
import { BankDetails } from './bank-payment-details';
import { AmountDetails } from './amount-details';

export class PaymentDetails {
  receiptMode: BilingualText = new BilingualText();
  transactionDate: GosiCalendar = new GosiCalendar();
  referenceNo: number = undefined;
  bank: BankDetails = new BankDetails();
  chequeDate: GosiCalendar = new GosiCalendar();
  chequeNumber: number = undefined;
  description: string = undefined;
  amountReceived: AmountDetails = new AmountDetails();
  status?: BilingualText = undefined;
  parentReceiptNo?: number = undefined;
  receiptGenerationDate?: GosiCalendar = new GosiCalendar();
  approvalStatus: BilingualText = new BilingualText(); // Added for receipt dashboard view
  reasonForCancellation: BilingualText = new BilingualText(); //Added for cancel receipt transaction
  cancellationComments: string = undefined; //Added for cancel receipt transaction
  cancellationReasonOthers: string; //Added for cancel receipt transaction
  name?: Name = undefined;
  comments?: string = undefined;
  fromJsonToObject(json) {
    Object.keys(new PaymentDetails()).forEach(key => {
      if (key in json) {
        if (key === 'bank') {
          this[key] = new BankDetails().fromJsonToObject(json[key]);
        } else if (key === 'amountReceived') {
          this[key] = new AmountDetails().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      } else this[key] = undefined;
    });
    return this;
  }
}
