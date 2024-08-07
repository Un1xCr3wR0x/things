/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class PatchPersonBankDetails {
  isNonSaudiIBAN = false;
  ibanBankAccountNo: string = undefined;
  bankCode: number = undefined;
  bankName: BilingualText = new BilingualText();
  bankAddress: string = undefined;
  swiftCode: string = undefined;
  verificationStatus: string = undefined;
  approvalStatus: string = undefined;
  comments: string = undefined;
  type: string = undefined;

  constructor() {}
}
