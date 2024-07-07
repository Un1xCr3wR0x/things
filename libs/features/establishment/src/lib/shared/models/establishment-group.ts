/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { AdminRoles } from './admin-roles';

export interface EstablishmentGroup {
  name: BilingualText;
  roles?: BilingualText[];
  adminRole?: AdminRoles[];
  registrationNo: number;
  establishmentType?: BilingualText;
  legalEntity?: BilingualText;
  location?: BilingualText;
  status?: BilingualText;
  noOfBranches?: number;
}
