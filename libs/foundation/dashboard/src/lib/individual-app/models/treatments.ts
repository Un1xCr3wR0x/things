import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Treatments {
  dailyAllowance: number;
  endDate: GosiCalendar = new GosiCalendar();
  startDate: GosiCalendar = new GosiCalendar();
  status: BilingualText = new BilingualText();
  type: BilingualText = new BilingualText();
  numberofDays: number;
}
