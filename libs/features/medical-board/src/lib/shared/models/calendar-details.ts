import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class CalendarDetails {
  count: number = undefined;
  date: GosiCalendar = new GosiCalendar();
  dateString: string;
  noOfDates: number = undefined;
  isSlotsAvailable: boolean;
  sessionId: number = undefined;
  sessionSpecialities?: BilingualText[];
  sessionSubSpecialties?: BilingualText[];
}
