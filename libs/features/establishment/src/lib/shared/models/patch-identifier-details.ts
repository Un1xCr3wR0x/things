/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { License, CRNDetails } from '@gosi-ui/core';

export interface PatchIdentifierDetails {
  license: License;
  navigationIndicator: Number;
  recruitmentNumber: Number;
  comments: string;
  contentIds: string[];
  crn: CRNDetails;
  unifiedNationalNumber?: number;
  uuid: string;
}
