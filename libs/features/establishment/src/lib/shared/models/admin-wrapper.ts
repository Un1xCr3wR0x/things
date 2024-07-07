/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Admin } from './admin';
import { AdminFilterResponse } from './admin-filter-response';
export class AdminWrapper {
  admins: Array<Admin> = [];
  adminFilterResponseDto?: AdminFilterResponse;
}
