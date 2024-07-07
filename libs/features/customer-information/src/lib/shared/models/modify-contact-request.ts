import { BilingualText, EmailType, MobileDetails } from '@gosi-ui/core';

export class ModifyContactRequest {
  addresses: AddressRequest[] = [];
  currentMailingAddress: string;
  emailId: EmailType = new EmailType();
  mobileNo: MobileDetails = new MobileDetails();
}
export class AddressRequest {
  type: string;
  country?: BilingualText = new BilingualText();
  city?: BilingualText = new BilingualText();
  district?: string;
  streetName?: string;
  postalCode?: string;
  postBox?: string;
  additionalNo?: number;
  buildingNo?: number;
  cityDistrict?: BilingualText = new BilingualText();
  detailedAddress?: string;
}
