/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TerminatedContracts {
  dateOfTermination: GosiCalendar;
  reasonForTermination: BilingualText;
  comments: string;
  contractId: number;
  commentsDto = {
    comments: undefined
  };
}
