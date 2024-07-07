/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AdminDto } from '.';
import { CommonPatch } from './common-patch';

export class ReplaceAdminRequest extends CommonPatch {
  currentAdmin: AdminDto;
  newAdmin: AdminDto;
}
