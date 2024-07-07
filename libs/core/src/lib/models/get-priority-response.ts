/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Modal for get priority api
 */
export class GetPriorityResponse {
  priorityMap: {
    HIGH: number;
    LOW: number;
    MEDIUM: number;
  };
  transactionMap: {
    COMPLETED: number;
    REASSIGNED: number;
    ASSIGNED: number;
  };
  performanceMap: {
    RETURN: number;
    REJECT: number;
  };
  totalCount: number;
}
