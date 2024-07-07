import { BilingualText } from '@gosi-ui/core';

export class InstallmentHistory {
  installmentDetails: Installments[];
}

export class Installments {
  bankGuaranteeIndicator: BilingualText = new BilingualText();
  installmentAmountPaid: number = undefined;
  installmentAmountRemaining: 0;
  installmentEndMonth: BilingualText = new BilingualText();
  installmentId: 0;
  installmentStartMonth: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
}
