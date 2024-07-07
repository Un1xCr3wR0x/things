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
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber
} from '@gosi-ui/core';
import { UserPreference } from './user-preference';
import { CalendarTypeHijiriGregorian } from './calendar-hijiri-gregorian';
import { SINDetails } from './sin-details';

/**
 * The wrapper class for personal information.
 *
 * @export
 * @class Person
 */
export class Person {
  personId: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  contactDetail: ContactDetails = new ContactDetails();
  contributorDetails?: SINDetails = new SINDetails();
  education: BilingualText = new BilingualText();
  maritalStatus: BilingualText = new BilingualText();
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sex: BilingualText = new BilingualText();
  specialization: BilingualText = new BilingualText();
  lifeStatus: string = undefined;
  govtEmp = false;
  userPreference: UserPreference = new UserPreference();
  socialInsuranceNumber: Array<number> = [];
  nicVerifiedDate?: Date = new Date();
}

export class SearchPerson {
  dob: CalendarTypeHijiriGregorian | GosiCalendar;
  birthDate: CalendarTypeHijiriGregorian | GosiCalendar;
  nationality: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sudiIdentity: { newNin: Number };
  heirNin?: Number;
  isUnborn: boolean;
  newBorn: boolean;
  ageOnEligibilityDate: number;
}
