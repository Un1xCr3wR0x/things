/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ClaimFilterParams {
  endDate: string = undefined;
  maxAmount: number = undefined;
  minAmount: number = undefined;
  startDate: string = undefined;
  treatmentDays = [];
  isMaxLimitExcluded = false;
}
