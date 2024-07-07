import { Person } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

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
