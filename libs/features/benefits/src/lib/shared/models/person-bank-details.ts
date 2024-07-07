/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class PersonBankDetails {
  isNonSaudiIBAN = false;
  ibanBankAccountNo: string = undefined;
  bankAccountId?: number;
  ibanBankAccountNoHidden: string = undefined;
  isIbanVerified = true;
  bankCode: number = undefined;
  bankName: BilingualText = new BilingualText();
  bankAddress: string = undefined;
  swiftCode: string = undefined;
  verificationStatus: string = undefined;
  approvalStatus: string = undefined;
  comments: string = undefined;
  isBankEdited: boolean;
  isNewlyAdded = false;
  constructor() {}
  bankAccountList?: PersonBankDetails[];
  holdStartDate?: GosiCalendar;
  savedAccount?: boolean;
  status?: BilingualText = new BilingualText();
  verificationMessageType?: string = undefined;
  verificationMessage?: BilingualText = new BilingualText();
  disableApprove = false;
  bankWarningMessage: BilingualText;
}

export class BankAccountList {
  bankAccountList: PersonBankDetails[];
  constructor() {
    this.bankAccountList = [];
  }
}

export class RecalculationBankDetails {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isSamaVerified: Boolean;
}
