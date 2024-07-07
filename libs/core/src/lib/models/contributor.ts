/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorStatus } from '../enums/contributor-status';
import { Person } from './person';
/**
 * Model class to hold contributor details.
 *
 * @export
 * @class Contributor
 */
export class Contributor {
  person: Person = new Person();
  contributorType: string = undefined;
  socialInsuranceNo: number = undefined;
  hasActiveWorkFlow? = false;
  vicIndicator = false;
  active = false;
  hasActiveTerminatedOrCancelled? = false;
  isBeneficiary? = false;
  hasLiveEngagement? = false;
  hasLiveEngagementInEstablishment? = false;
  statusType: string = ContributorStatus.INACTIVE;
  hasVICEngagement?: boolean; //Added for enabling VIC options in side menu if the person is having atleast one VIC engagement.
  /**
   * Creates an instance of Contributor.
   *
   * @memberof Contributor
   */
  constructor() {}

  fromJsonToObject(json: Contributor) {
    Object.keys(new Contributor()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
