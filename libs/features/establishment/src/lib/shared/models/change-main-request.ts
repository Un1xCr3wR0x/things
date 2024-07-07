/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonPatch } from './common-patch';

export class ChangeMainRequest extends CommonPatch {
  newMainRegistrationNo: number;
}
