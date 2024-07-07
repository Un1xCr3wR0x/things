import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Period } from './period';
export class WaiveOffDetails {
  amount: number;
  penaltyWaiverId : number = undefined;
  percentage: number;
  period: Period = new Period();
  status: BilingualText = new BilingualText();
  type: string= undefined;
  violationsWaiverAmount : number = undefined;
  waiverViolationsPercentage : number = undefined;
  transactionDate: GosiCalendar = new GosiCalendar();
}
