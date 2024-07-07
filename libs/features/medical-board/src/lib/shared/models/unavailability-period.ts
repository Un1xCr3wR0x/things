import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class UnAvailabilityPeriod {
  reason: BilingualText;
  calendarId: number;
  professionalId: number;
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  comments: BilingualText;
  confirmMessage: BilingualText;
  unavailablePeriodResponseMessage?: BilingualText;
}
