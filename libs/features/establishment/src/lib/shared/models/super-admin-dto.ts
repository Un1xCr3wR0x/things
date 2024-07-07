/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdminDto } from './admin-dto';

export class SuperAdminDto extends AdminDto {
  navigationIndicator: number = undefined;
  comments: string = undefined;
  contentIds = []; //for multiple pages
  referenceNo?: number = undefined;
}
