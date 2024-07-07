import { BilingualText } from '@gosi-ui/core';
import { BankDataDetails } from './bank-data';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BankAccountListing {
  bankAccountList: BankDataDetails[];
  approvalStatus: string;
  bankAddress: string;
  bankCode: number;
  bankName: BilingualText;
  comments: string;
  ibanBankAccountNo: string;
  isNonSaudiIBAN: boolean;
  mbupdate: boolean;
  referenceNo: number;
  serviceType: number[];
  status: BilingualText;
  swiftCode: string;
  verificationStatus: string;
}
