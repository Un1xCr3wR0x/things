import { GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ComplaintRequest {
  category: string;
  complainant: number = null;
  description: string;
  registrationNo: string = null;
  registrationNos: any;
  subType: string;
  transactionRefNo: number = null;
  type: string;
  uuid: string = null;
  complainantDetails: ComplainantDetails = new ComplainantDetails();
  csrComment: string = null;
  isReturned?: boolean;
  isEstAdminOrOwner?: boolean;
}

export class ComplainantDetails {
  name: string;
  birthDate: { gregorian: string; hijiri: string };
  contactDetail: ContactDetail = new ContactDetail();
  identity: Identity = new Identity();
}
export class ContactDetail {
  email: string;
  phoneNo: string;
}
export class Identity {
  idType: string;
  newNin: string;
  iqamaNo: string;
}
