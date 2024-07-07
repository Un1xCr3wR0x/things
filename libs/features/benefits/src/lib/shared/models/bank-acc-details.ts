/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class BankAccDetails {
  approvalStatus: string = undefined;
  bankAddress: string = undefined;
  bankCode: number = undefined;
  bankName: BilingualText = new BilingualText();
  comments: string = undefined;
  ibanBankAccountNo: string = undefined;
  isNonSaudiIBAN: boolean = undefined;
  swiftCode: string = undefined;
  verificationStatus: string = undefined;
}
