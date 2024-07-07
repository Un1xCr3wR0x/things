/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Person } from '@gosi-ui/core';

export class IndividualSearchDetails {
  socialInsuranceNo: number;
  vicIndicator = false;
  person: Person;
  hasActiveWorkFlow = false;
  contributorType: string;
  hasActiveTerminatedOrCancelled = true;
  active = true;
  statusType?: string;
}
