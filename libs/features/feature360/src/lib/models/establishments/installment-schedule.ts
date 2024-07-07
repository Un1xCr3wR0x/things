import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class InstallmentSchedule {
  installmentMonth: BilingualText = new BilingualText();
  installmentNumber: number = undefined;
  monthlyInstallmentAmount: number = undefined;
  paymentDate: GosiCalendar = new GosiCalendar();
  installmentAmountRemaining: number = undefined;
  status: BilingualText = new BilingualText();
}
