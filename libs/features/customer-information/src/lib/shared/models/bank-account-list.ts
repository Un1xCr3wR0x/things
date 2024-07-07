/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class BankAccountListDetails {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isSamaVerified: Boolean;
}
