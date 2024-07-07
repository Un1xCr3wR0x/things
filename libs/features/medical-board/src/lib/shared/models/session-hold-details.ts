import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class SessionHoldDetails {
  id: number;
  holdEndDate: GosiCalendar = new GosiCalendar();
  holdReason: BilingualText;
  holdStartDate: GosiCalendar = new GosiCalendar();
  modifyStartDate:GosiCalendar=new GosiCalendar();
  modifyEndDate:GosiCalendar=new GosiCalendar();
  comments?: string;
  canHold?: boolean;
}
