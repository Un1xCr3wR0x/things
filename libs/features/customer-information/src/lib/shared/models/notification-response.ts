/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class NotificationResponse {
  list: Notification[];
  totalRecords: number;
}

interface Notification {
  transactionname: string;
  type: string;
  lastsent: string;
  sms: string;
  status: string;
}

export interface NotificationResponseDTO {
  elements: any[];
  length: number;
}