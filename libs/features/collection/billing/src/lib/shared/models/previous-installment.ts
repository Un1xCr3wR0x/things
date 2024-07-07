/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class PreviousInstallment {
  installmentAmountPaid: number = undefined;
  installmentAmountRemaining: number;
  installmentEndMonth: BilingualText = new BilingualText();
  installmentId: number = undefined;
  installmentStartMonth: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
}
