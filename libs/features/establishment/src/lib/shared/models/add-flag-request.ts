import { FlagRequest } from './flag-request';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class AddFlagRequest extends FlagRequest {
  type: BilingualText;
  reason: BilingualText;
  startDate: GosiCalendar = new GosiCalendar();
}
