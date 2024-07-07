import { BilingualText, Name, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';
import { MbList } from './member-list';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MemberResponse {
  mbList: MbList[];
  totalNoOfRecords: number;
}
