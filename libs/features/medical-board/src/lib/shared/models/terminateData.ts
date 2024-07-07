import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TerminateData {
  contractId: number;
  dateOfTermination: GosiCalendar = new GosiCalendar();
  reasonForTermination: BilingualText;
  transactionTraceId: number;
  comments: string;
  commentsDto? = {
    comments: undefined
  };
}
