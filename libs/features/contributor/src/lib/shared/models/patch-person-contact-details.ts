import { EmailType, MobileDetails, PhoneDetails } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PatchPersonContactDetails {
  emailId: EmailType = new EmailType();
  faxNo: string = undefined;
  mobileNo: MobileDetails = new MobileDetails();
  mobileNoVerified = false;
  telephoneNo: PhoneDetails = new PhoneDetails();
  type: string = undefined;

  constructor() {}
}
