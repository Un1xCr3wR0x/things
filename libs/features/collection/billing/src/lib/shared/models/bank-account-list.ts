/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';

export class BankAccountList {
  isNonSaudiIBAN: boolean = undefined;
  ibanBankAccountNo: string = undefined;
  bankName: BilingualText = new BilingualText();
  bankCode: number;
  verificationStatus: string = undefined;
  approvalStatus: string = undefined;
  bankAddress: string = undefined;
  swiftCode: string = undefined;
  status: BilingualText = new BilingualText();
  comments: string = undefined;
}
