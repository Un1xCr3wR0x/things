/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class PersonBankDetails {
  isNonSaudiIBAN = false;
  ibanBankAccountNo: string = undefined;
  ibanBankAccountNoHidden: string = undefined;
  isIbanVerified = true;
  bankCode: number = undefined;
  bankName: BilingualText = new BilingualText();
  bankAddress: string = undefined;
  swiftCode: string = undefined;
  verificationStatus: string = undefined;
  approvalStatus: string = undefined;
  status?: BilingualText = undefined;
  comments: string = undefined;
  isBankEdited: boolean;
  disableApprove = false;
  bankWarningMessage?: BilingualText;
  constructor() {}
  bankAccountList?: PersonBankDetails[];
}

export interface BankAccountsList {
  bankAccountList: PersonBankDetails[];
}

export class RecalculationBankDetails {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isSamaVerified: Boolean;
}
