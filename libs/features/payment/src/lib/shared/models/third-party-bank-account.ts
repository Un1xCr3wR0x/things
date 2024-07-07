/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

/*
 *This model class is to hold bank account details
 *
 *  */
export class ThirdPartyBankAccount {
  ibanAccountNo: string = undefined;
  bankName: BilingualText = new BilingualText();
  payeeId: number = undefined;
  payeeCode: string = undefined;
  payeeName: BilingualText = new BilingualText();
  payeeType: BilingualText = new BilingualText();
  adjustmenID: number;
}
