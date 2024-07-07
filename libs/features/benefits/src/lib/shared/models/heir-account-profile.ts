/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorDetails } from './contributor-details';
import { HeirPersonDetails } from './heir-person-details';

export class HeirAccountProfile {
  heirPersonalDetails: HeirPersonDetails;
  linkedContributorDetails: ContributorDetails[];
}

export interface HeirPersonIds {
  authPersonId: number;
  HeirId: number;
}
