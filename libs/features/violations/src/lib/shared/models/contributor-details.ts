/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, DocumentItem, GosiCalendar, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { BenefitInfo } from './benefit-info';
import { EngagementDetails } from './engagement-details';
import { ViolationList } from './violation-list';

export class ContributorDetails {
  contributorId: number;
  contributorName: BilingualText;
  dateOfBirth: GosiCalendar;
  excluded: boolean;
  excludedInModify: boolean;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  modified: boolean;
  nationalId: number;
  penaltyAmount: number = undefined;
  socialInsuranceNo: number;
  totalContributionAmount: number;

  vlContributorId: number = undefined;
  vlContModified: boolean;
  previousViolationRecordDesc: BilingualText;
  engagementInfo: EngagementDetails[];
  benefitInfo: BenefitInfo[];
  newPenaltyAmount?: number = undefined;
  compensated?: BilingualText;
  previousCancelledEngagementViolation: BilingualText;
  repetetionTier?: BilingualText;
  showMandatoryError?: boolean;
  isSaved?: boolean;
  isNoPenalty?: boolean;
  totalBenefitAmount?: number;
  violationStartDate?:GosiCalendar = new GosiCalendar();
  violationList?:ViolationList[]=[];
  showPrevViolationTable?:boolean;
  reason?: string; // Manually added flag (Optional). It is used when merging appeal and violation response
  documents?: DocumentItem[]; // Manually added flag (Optional). It is used when merging both appeal and violation responses
  docReview?: string;  // Manually added flag (Optional). It is used when merging both appeal and violation responses

}
