/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class BranchFilter {
  establishmentStatusCode: string = undefined;
  fieldOffice: BilingualText[] = []; //to be removed
  status: BilingualText[] = [];
  legalEntity: BilingualText[] = [];
  location: number[] = [];
  molEstIncluded = true;
  includeAllStatus = false;
  adminId?: string;
  role?: number;
}
