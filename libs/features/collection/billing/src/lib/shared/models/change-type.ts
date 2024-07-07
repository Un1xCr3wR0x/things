import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ChangeType {
  changeType: BilingualText = new BilingualText();
  endDate: GosiCalendar = new GosiCalendar();
  newContributoryWage: number = undefined;
  newOHPercentage: number = undefined;
  oldContributoryWage: number = undefined;
  oldOHPercentage: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  transactionDate: GosiCalendar = new GosiCalendar();
}
