/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, ContactDetails } from '@gosi-ui/core';

export class MiscPaymentRequest {
  agentId: number;
  agentType: BilingualText;
  bankAccountId: number;
  ibanBankAccountNo: string;
  newBankAccount: NewBankAccountRequest;
  contactDetail?: ContactDetails;
  newIban = false;
  referenceNo: number;
  isNewContactDetails?: boolean;
}

export class NewBankAccountRequest {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isNonSaudiIBAN = false;
  swiftCode?: string = undefined;
  isSamaVerified = false;
  serviceType: string;
  status: BilingualText;
  verificationStatus: string;
}
