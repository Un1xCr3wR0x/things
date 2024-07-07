/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AdminDto } from './admin-dto';
import { CommonPatch } from './common-patch';
import { DelinkBranch } from './delink-branch';

export class DelinkRequest extends CommonPatch {
  newMainRegNo: number;
  branches: DelinkBranch[];
  newAdmin: AdminDto;
}
