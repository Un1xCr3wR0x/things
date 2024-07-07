/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Engagement } from './engagement';
import { Person } from './person';

export class ContributorSearchResult {
  active = false;
  approvalStatus: string = undefined;
  engagements?: Engagement[] = [];
  mergedSocialInsuranceNo: number = undefined;
  mergerStatus: string = undefined;
  person: Person = new Person();
  socialInsuranceNo: number = undefined;
  vicIndicator = true;
  contributorType: string;
  statusType: string;
}
