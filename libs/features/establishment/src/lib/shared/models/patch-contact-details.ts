/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EmailType, MobileDetails, PhoneDetails } from '@gosi-ui/core';

export interface PatchContactDetails {
  comments: string;
  contentIds: string[];
  emailId: EmailType;
  faxNo: string;
  mobileNo: MobileDetails;
  telephoneNo: PhoneDetails;
  navigationIndicator: number;
  referenceNo: number;
  uuid: string;
}
