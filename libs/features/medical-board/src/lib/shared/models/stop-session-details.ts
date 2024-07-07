import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class StopSessionDetails {
  comments: string = undefined;
  stopReason: BilingualText = new BilingualText();
  stopDate: GosiCalendar = new GosiCalendar();
}
