/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BankAccount, Person, PersonalInformation } from '@gosi-ui/core';
/**
 * Model class to hold contributor details.
 *
 * @export
 * @class Contributor
 */
export class Contributors {
  person: PersonalInformation = new PersonalInformation();
  type: string = undefined;
  active = false;
  contributorType: string = undefined;
  socialInsuranceNo: number = undefined;
  vicIndicator: boolean = undefined;
  bankAccountDetails?: BankAccount[];
  isBeneficiary?: boolean;
  isAnnuityBeneficiary?: boolean;
  statusType: string = undefined;
  hasActiveTerminatedOrCancelled?: boolean;
  hasLiveEngagement?: boolean;
  hasVICEngagement?: boolean;
  hasNonVICEngagement?: boolean;

  fromJsonToObject(json: Contributors) {
    Object.keys(new Contributors()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
export class VicContributorDetails {
  person: Person = new Person();
  contributorType: string = undefined;
  socialInsuranceNo: number = undefined;
  hasActiveWorkFlow? = false;
  vicIndicator = false;
  active = false;
  statusType: string;
  hasActiveTerminatedOrCancelled? = false;

  /**
   * Creates an instance of Contributor.
   *
   * @memberof Contributor
   */
  constructor() {}

  fromJsonToObject(json: VicContributorDetails) {
    Object.keys(new VicContributorDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}