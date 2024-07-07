/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

//model to get simis api adjustment wage details
export class AdjustmentWageDetails {
  ContributorName: string;
  Coverage: string;
  FromDate: string;
  Nationality: string;
  ADJUSTMENTTYPE: number;
  P_ESTACCMAPPINGID: string;
  SOCIALINSURANCENUMBER: number = undefined;
  ToDate: string;
  WAGE: number = undefined;
}
