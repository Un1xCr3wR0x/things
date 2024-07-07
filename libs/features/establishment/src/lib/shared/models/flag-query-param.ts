/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class FlagQueryParam {
  flagType: string = undefined;
  flagReason: string[];
  initiatedBy: string[];
  startDate: string = undefined;
  endDate: string = undefined;
  status: string = undefined;
  transactionTraceId: number;
  getTransient: boolean;
  getWorkflow: boolean;
  flagId: number;
  orderBy?: string;
  sortBy?: string;
  isFlagTransaction = true;
  isFlagTracking?: boolean;
}
