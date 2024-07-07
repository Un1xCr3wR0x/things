/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { ContactDetails } from './contact-details';
import { GosiCalendar } from './gosi-calendar';
import { Name } from './name';
import { Iqama } from './iqama';
import { NIN } from './nin';
import { NationalId } from './national-id';
import { Passport } from './passport';
import { BorderNumber } from './border-number';
import { UserPreference } from './user-preference';

export class Person {
  personId: number = undefined;
  ageInHijiri?: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  maritalStatus: BilingualText = new BilingualText();
  education: BilingualText = new BilingualText();
  name: Name = new Name();
  nationality?: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  nationalId?: NationalId;
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
  lifeStatus?: string = undefined;
  socialInsuranceNumber: number[] = [];
  contributorType?: string = undefined;
  registrationNo?: number = undefined;
  establishmentName?: BilingualText = undefined;

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
