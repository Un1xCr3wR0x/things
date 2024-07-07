import { BilingualText, BorderNumber, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ChangeViolationContributors {
  contributorId: number;
  engagementId: number;
  contributorName: BilingualText;
  currentPenaltyAmount: number;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  newPenaltyAmount: number;
  violationContributorId: number;
  isExcluded: boolean;
  modified?: boolean;
  socialInsuranceNo?: number;
}
