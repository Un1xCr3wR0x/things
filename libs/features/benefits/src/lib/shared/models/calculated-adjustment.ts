import { GosiCalendar } from '@gosi-ui/core';

interface SuspendDetails {
  adjustmentAmount: number;
  paymentDate: GosiCalendar;
}

export class CalculatedAdjustment {
  totalAdjustmentAmount: number;
  suspendDetailsList: Array<SuspendDetails>;
}
