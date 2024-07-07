/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MyTeamResponse {
  totalCount: number;
  response: ReporteeObject[];
}

export interface ReporteeObject {
  name: string;
  id: string;
  role: ReporteeRole[];
  mail: string;
  mobile: string;
  pendingTransaction: number;
  status: string;
  statusLabel: string;
  olaCount: number;
}

export interface ReporteeRole {
  role: string[];
}
