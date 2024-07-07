/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
///TODO Use from core
import { AdminDto } from './admin-dto';
import { AdminFilterResponse } from './admin-filter-response';
//Use to bind the response of admin wrapper
//Any change in this dto should be also in admin-wrapper and the corresponding binding to be done in all services.
export class AdminDtoWrapper {
  admins: Array<AdminDto> = [];
  adminFilterResponseDto: AdminFilterResponse;
}
