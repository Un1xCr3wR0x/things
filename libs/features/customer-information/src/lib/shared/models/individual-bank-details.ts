/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class IndividualBankDetails {
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
  comments: string = undefined;
  isBankEdited: boolean;
  isNewlyAdded = false;
  constructor() {}
  bankAccountList?: IndividualBankDetails[];
  holdStartDate?: GosiCalendar;
  bankHoldStatus?: boolean;
  uuid?: string;
}

export interface IndividualBankAccountList {
  bankAccountList: IndividualBankDetails[];
}

export class RecalculationBankDetails {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isSamaVerified: Boolean;
}

export class IBANRESULT {
  ibanValidationResult: BilingualText;
  ibanStatus: string;
}
