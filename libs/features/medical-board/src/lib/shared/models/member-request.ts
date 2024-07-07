/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

import { MemberFilter } from './member-filter';

export class MemberRequest {
  filter: MemberFilter = new MemberFilter();
  pageNo: number = undefined;
  pageSize: number = undefined;
  searchKey: string = undefined;
  sortOrder: string = undefined;
  listOfDoctorType: BilingualText[] = [];
  listOfRegion: BilingualText[] = [];
  listOfStatus: BilingualText[] = [];
  listOfSpecialty: BilingualText[] = [];
}
