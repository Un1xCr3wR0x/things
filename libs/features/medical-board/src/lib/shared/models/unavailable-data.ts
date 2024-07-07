import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class UnAvailableData {
  reason: BilingualText;
  unavailableStartDate: GosiCalendar = new GosiCalendar();
  unavailableEndDate: GosiCalendar = new GosiCalendar();
  comments: BilingualText;
}
