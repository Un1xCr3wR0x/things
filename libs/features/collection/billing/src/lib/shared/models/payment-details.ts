/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, Name } from '@gosi-ui/core';
import { BranchBreakup } from './branch-breakup';
import { BankDetails } from './bank-details';
import { AmountDetails } from './amount-details';

export class PaymentDetails {
  billBatchIndicator: boolean;
  receiptMode: BilingualText = new BilingualText();
  transactionDate: GosiCalendar = new GosiCalendar();
  referenceNo: number = undefined;
  bank: BankDetails = new BankDetails();
  chequeDate: GosiCalendar = new GosiCalendar();
  chequeNumber: number = undefined;
  description: string = undefined;
  amountAllocated: AmountDetails = new AmountDetails();
  amountReceived: AmountDetails = new AmountDetails();
  branchAmount: BranchBreakup[] = [];
  status?: BilingualText = undefined;
  parentReceiptNo?: string = undefined;
  ibanAccountNo?: string = undefined;
  receiptGenerationDate?: GosiCalendar = new GosiCalendar();
  approvalStatus: BilingualText = new BilingualText(); // Added for receipt dashboard view
  reasonForCancellation: BilingualText = new BilingualText(); //Added for cancel receipt transaction
  cancellationComments: string = undefined; //Added for cancel receipt transaction
  cancellationReasonOthers: string; //Added for cancel receipt transaction
  name?: Name = new Name();
  comments?: string = undefined;
  penaltyIndicator: BilingualText = new BilingualText();
  uploadReferenceNo: number = null;
  initiatedDate: GosiCalendar = new GosiCalendar();
  mofIndicator?: string = undefined;
  fromJsonToObject(json) {
    Object.keys(new PaymentDetails()).forEach(key => {
      if (key in json) {
        if (key === 'branchAmount' && json[key]) {
          if (json[key].length > 0) {
            for (let i = 0; i < json[key].length; i++) {
              this[key].push(new BranchBreakup().fromJsonToObject(json[key][i]));
            }
          }
        } else if (key === 'bank') {
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
