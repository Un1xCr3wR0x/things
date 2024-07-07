/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Owner } from '.';
import { CommonPatch } from './common-patch';

export class OwnerRequest extends CommonPatch {
  owners: Owner[] = [];
}
