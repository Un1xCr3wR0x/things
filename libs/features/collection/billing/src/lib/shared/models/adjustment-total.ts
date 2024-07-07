/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

//model to get simis api adjustment total details
export class AdjustmentTotal {
  ADJUSTMENTTYPE: number = undefined;
  IND: string;
  Others: number = undefined;
  P_ESTACCMAPPINGID: string;
  SHORTNAMEARABIC: string;
  TotalAnnuityContribution: number = undefined;
  TotalAnnuityPenalty: number = undefined;
  TotalContributionandPenalty: number = undefined;
  TotalOHContribution: number = undefined;
  TotalOHPenalty: number = undefined;
  TotalUIContribution: number = undefined;
  TotalUIPenalty: number = undefined;
}
