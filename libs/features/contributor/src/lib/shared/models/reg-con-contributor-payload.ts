/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  GosiCalendar,
  Name,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  ContactDetails,
  UserPreference
} from '@gosi-ui/core';

export class SaveContributorPayload {
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: Name = new Name();
  sex: BilingualText = new BilingualText();
  education: BilingualText = new BilingualText();
  specialization: BilingualText = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate: GosiCalendar = new GosiCalendar();
  maritalStatus: BilingualText = new BilingualText();
  contactDetail: ContactDetails = new ContactDetails();
  student = false;
  prisoner = false;
  proactive = false;
  lifeStatus = false;
  userPreferences?: UserPreference = new UserPreference();
  contributorType: string = undefined;
  personId: number = undefined;
}
