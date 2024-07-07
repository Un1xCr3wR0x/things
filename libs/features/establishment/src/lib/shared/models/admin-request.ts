/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Admin } from './admin';
import { CommonPatch } from './common-patch';

export class AdminRequest extends CommonPatch {
  currentAdmin: Admin;
  newAdmin: Admin;
}
