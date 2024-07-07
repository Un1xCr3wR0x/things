/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorWageDetails } from './contributor-wage-details';
import { BilingualText } from '@gosi-ui/core';
//TODO Change spelling
/**
 * This class is model class for get multiple contributor wage details
 */
export class ContributorWageDetailsResponse {
  contributors: ContributorWageDetails[] = [];
  pageNo: number = undefined;
  pageSize: number = undefined;
  numberOfContributors: number = undefined;
  legalEntity: BilingualText = new BilingualText();
}
