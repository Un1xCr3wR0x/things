import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ChangeRequest {
  id: number = undefined;
  type: string;
  status: string;
  oldValue: string;
  newValue: string;
  referenceNo: number = undefined;
  submissionDate: GosiCalendar = new GosiCalendar();
  bankName: BilingualText = new BilingualText();
}
