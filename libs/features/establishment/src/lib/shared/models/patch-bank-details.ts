import { BankAccount, BilingualText, GosiCalendar } from '@gosi-ui/core';
import { CommonPatch } from './common-patch';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PatchBankDetails extends CommonPatch {
  bankAccount: BankAccount;
  startDate: GosiCalendar;
  paymentType: BilingualText;
  uuid: string = undefined;
  accountStatus?: string;
  matchStatus?: string;
  creditStatus?: string;
}
