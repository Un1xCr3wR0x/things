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
  convertToStringDDMMYYYY,
  convertToStringYYYYMMDD
} from '@gosi-ui/core';
import { UserPreference } from './user-preference';
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
  ageInHijiri?: number;
}
export const getAge = function (birthDate, age) {
  if (age === 1) {
    return convertToStringYYYYMMDD(birthDate.toString()) + ' ' + '(السن : العمر )';
  } else if (age === 2) {
    return convertToStringYYYYMMDD(birthDate.toString()) + ' ' + '(سنتان  : العمر )';
  } else if (age > 2 && age < 11) {
    return convertToStringYYYYMMDD(birthDate.toString()) + ' ' + '(العمر : ' + age + ' سنوات )';
  } else if (age > 11) {
    return convertToStringYYYYMMDD(birthDate.toString()) + ' ' + '(العمر : ' + age + ' سنة )';
  }
};
