import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AddMembersWrapper {
  totalResponse: number;
  addMembersResponse: AddMembersResponse[];
}
export class AddMembersResponse {
  name: BilingualText;
  nin: number;
  contractType: BilingualText;
  availabilty: BilingualText;
  speciality: BilingualText;
  location: BilingualText;
  mobileNo: string;
}
