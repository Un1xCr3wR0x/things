/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AddressDetails,
  AddressTypeEnum,
  BilingualText,
  BorderNumber,
  EmailType,
  GosiCalendar,
  Iqama,
  MobileDetails,
  Name,
  NationalId,
  NIN,
  Passport,
  PhoneDetails
} from '@gosi-ui/core';

export class ProfileWrapper {
  personDetails: PersonDetails;
  educationDetails: EducationDetails;
  contactDetails: ContactDetails;
}
export class PersonDetails {
  nationality: BilingualText = new BilingualText();
  maritalStatus: BilingualText = new BilingualText();
  gender: BilingualText = new BilingualText();
  dateOfBirth: GosiCalendar = new GosiCalendar();
  name: Name;
  ageInHijiri: number;
  personId?: number;
  personIdentities: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
}
export class EducationDetails {
  education: BilingualText = new BilingualText();
  specialization: BilingualText = new BilingualText();
}
export class FinancialDetails {
  bankAccountList: BankAccountList[] = [];
  totalCount: number;
}
export class BankAccountList {
  status: BilingualText = new BilingualText();
  bankName: BilingualText = new BilingualText();
  ibanBankAccountNo: string;
  serviceType: Array<string> = [];
}
export class ContactDetails {
  emailId: EmailType = new EmailType();
  faxNo: string = undefined;
  mobileNo: MobileDetails = new MobileDetails();
  telephoneNo: PhoneDetails = new PhoneDetails();
  addresses?: AddressDetails[] = [];
  mobileNoVerified? = false;
  currentMailingAddress?: string = AddressTypeEnum.NATIONAL;
  emergencyContactNo: number = undefined;

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
