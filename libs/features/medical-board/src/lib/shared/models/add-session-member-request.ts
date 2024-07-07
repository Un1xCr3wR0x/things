import { AddMemberFilterRequest } from './add-member-filter-request';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AddSessionMemberRequest {
  searchKey: string = undefined;
  filter: AddMemberFilterRequest = new AddMemberFilterRequest();
}
