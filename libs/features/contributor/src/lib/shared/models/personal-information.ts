/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  GosiCalendar,
  ContactDetails,
  BilingualText,
  Name,
  Iqama,
  Passport,
  NIN,
  NationalId,
  BorderNumber,
  UserPreference
} from '@gosi-ui/core';

/**
 * The wrapper class for personal information.
 *
 * @export
 * @class PersonalInformation
 */
export class PersonalInformation {
  id: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  borderNo: number = undefined;
  contactDetail: ContactDetails = new ContactDetails();
  education: BilingualText = new BilingualText();
  maritalStatus: BilingualText = new BilingualText();
  name: Name = new Name();
  fullName: string = undefined;
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sex: BilingualText = new BilingualText();
  specialization: BilingualText = new BilingualText();
  lifeStatus: string = undefined;
  personType?: string = undefined;
  student? = false;
  prisoner? = false;
  personId: number = undefined;
  role: string = undefined;
  iqama: Iqama = new Iqama();
  passport: Passport = new Passport();
  nin: NIN = new NIN();
  nationalId: NationalId = new NationalId();
  govtEmp? = false;
  absherVerificationStatus: string = undefined;
  socialInsuranceNumber: number[] = [];
  ageInHijiri?: number;
  contributorType: string = undefined;

  userPreferences?: UserPreference = new UserPreference();
  proactive? = false;

  /**
   * Setting values into model
   */
  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new PersonalInformation()) {
        if (key === 'name') {
          this.name = new Name().fromJsonToObject(json[key]);
        } else if (key === 'contactDetail') {
          this.contactDetail = new ContactDetails().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
