import { GosiCalendar, DocumentItem } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ReceiveClarification {
  clarificationComments: string;
  clarificationRead: boolean;
  clarificationReceived: boolean;
  requestComments: string;
  requestedDate: {
    gregorian: GosiCalendar;
    hijiri: GosiCalendar;
  };
  resolvedDate: {
    gregorian: GosiCalendar;
    hijiri: GosiCalendar;
  };
  role: string;
  requestId: number;
  user: string;
  serviceId = [];
  allowanceId = [];
  documents?: DocumentItem[];
}
