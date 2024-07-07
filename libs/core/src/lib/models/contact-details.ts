/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AddressTypeEnum } from '../enums';
import { AddressDetails } from './address-details';
import { EmailType } from './email-type';
import { MobileDetails } from './mobile-details';
import { PhoneDetails } from './phone-details';

export class ContactDetails {
  emailId: EmailType = new EmailType();
  faxNo: string = undefined;
  mobileNo: MobileDetails = new MobileDetails();
  telephoneNo: PhoneDetails = new PhoneDetails();
  addresses?: AddressDetails[] = [];
  mobileNoVerified? = false;
  currentMailingAddress?: string = AddressTypeEnum.NATIONAL;
  emergencyContactNo: number = undefined;
  createdBy? = '';
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  /**
   * Mapping json values into model
   */
  fromJsonToObject(json: ContactDetails) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key in new ContactDetails()) {
          if (key === 'emailId') {
            this[key] = new EmailType().fromJsonToObject(json[key]);
          } else if (key === 'mobileNo') {
            this[key] = new MobileDetails().fromJsonToObject(json[key]);
          } else if (key === 'telephoneNo') {
            this[key] = new PhoneDetails().fromJsonToObject(json[key]);
          } else {
            this[key] = json[key];
          }
        }
      });
    }
    return this;
  }
}
