/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { PersonalInformation } from './personal-information';
import { BankAccount } from '@gosi-ui/core';
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