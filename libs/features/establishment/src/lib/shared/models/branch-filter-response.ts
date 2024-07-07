/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Lov } from '@gosi-ui/core';

export class BranchFilterResponse {
  status: Array<Lov>;
  legalEntities: Array<Lov>;
  roles: number[];
  fieldOffice: Array<Lov>;
  locations: Array<Lov>;
}
