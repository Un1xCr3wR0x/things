import { BilingualText } from '@gosi-ui/core';
import { ContributorRequestDetails } from './contributor-request';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PenaltyInfo {
  channel: string;
  contributorRequestDetails: ContributorRequestDetails[];
  violationClass: BilingualText;
  violationType: BilingualText;
}
