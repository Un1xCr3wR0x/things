import { GosiCalendar } from './gosi-calendar';
import { ListItems } from './transaction-reference-data';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ItTicketHistory {
  comments: string;
  createdDate: GosiCalendar = new GosiCalendar();
  resolvedDate: GosiCalendar = new GosiCalendar();
  ticketNumber: string;
  ticketStatus: string;
  srNumber: string;
  traceId: number;
  resolverComment?: ListItems[] = [];
}


