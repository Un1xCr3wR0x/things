/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Engagement } from './engagement';
import { Person } from './person';

/**
 * Model class to hold contributor details.
 *
 * @export
 * @class Contributor
 */

export class Contributor {
  active = false;
  approvalStatus: string = undefined;
  engagements?: Engagement[];
  mergedSocialInsuranceNo: number = undefined;
  mergerStatus: string = undefined;
  person: Person = new Person();
  socialInsuranceNo: number = undefined;
  type: string = undefined;
  vicIndicator = false;
}
