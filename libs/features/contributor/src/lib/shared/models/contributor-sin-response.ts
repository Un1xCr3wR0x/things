/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { engagementDraftDetailsdto } from './engagement-details-dto';
import { PersonalInformation } from './personal-information';
/**
 * Model class to hold contributorService.getSin() response details.
 *
 * @export
 * @class Contributor
 */
export class ContributorSinResponse {
  person: PersonalInformation = new PersonalInformation();
  socialInsuranceNo: number;
  mergedSocialInsuranceNo: number;
  mergerStatus: string;
  contributorType: string;
  active: boolean;
  isBeneficiary?: boolean;
  vicIndicator?: boolean;
  engagementDraftDetailsdto:engagementDraftDetailsdto;
}
