import { GosiCalendar } from '@gosi-ui/core';
import { CalendarDetails } from './calendar-details';

export class SessionCalendar {
  participantsInQueue: number = undefined;
  totalCount: number = undefined;
  sessionDetails: CalendarDetails[];
  sessionForLocSpecEndDate: GosiCalendar = new GosiCalendar();
  sessionForLocSpecStartDate: GosiCalendar = new GosiCalendar();
}
