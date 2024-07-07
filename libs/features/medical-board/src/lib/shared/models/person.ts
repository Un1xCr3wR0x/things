/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BankDataDetails } from './bank-data';
import { GosiCalendar, BilingualText, Name, NationalId, Iqama, NIN, BorderNumber, Passport, UserPreference, ContactDetails } from '@gosi-ui/core';

export class Person {
  personId: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  maritalStatus: BilingualText = new BilingualText();
  education: BilingualText = new BilingualText();
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sex: BilingualText = new BilingualText();
  role: string = undefined;
  specialization: BilingualText = undefined;
  contactDetail: ContactDetails = new ContactDetails();
  userPreferences?: UserPreference = new UserPreference();
  personType?: string = undefined;
  student? = false;
  prisoner? = false;
  govtEmp? = false;
  proactive? = false;
  bankAccount: BankDataDetails;
  socialInsuranceNumber: number[] = [];
  ageInHijiri:number;
  /**
   * Setting values into model
   */
  fromJsonToObject(json: Person) {
    Object.keys(json).forEach(key => {
      if (key in new Person()) {
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
