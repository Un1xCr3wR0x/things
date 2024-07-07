/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, BankAccount } from '@gosi-ui/core';

export class CancelContributorRequest {
  editFlow: boolean = undefined;
  comments: string = undefined;
  cancellationReason: BilingualText = new BilingualText();
  uuid?: string;
  bankAccount?: BankAccount;
}
