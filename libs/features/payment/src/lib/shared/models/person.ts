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
  BorderNumber,
  UserPreference
} from '@gosi-ui/core';

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
}

export class SearchPerson {
  dob: CalendarTypeHijiriGregorian;
  nationality: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sudiIdentity: { newNin: Number };
  heirNin?: Number;
}
export interface CalendarTypeHijiriGregorian {
  gregorian: string;
  hijiri: string;
  calendarType: string;
}

export class PersonDto {
  recordCount: number;
  listOfPersons: Person[] = [];
}
