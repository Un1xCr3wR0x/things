import {
  BilingualText,
  BorderNumber,
  ContactDetails,
  GosiCalendar,
  Iqama,
  Name,
  NationalId,
  NIN,
  Passport,
  UserPreference
} from '@gosi-ui/core';

export class RegisterAuthorizationPerson {
  birthDate: GosiCalendar = new GosiCalendar();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  sex: BilingualText = new BilingualText();

  contactDetail?: ContactDetails = new ContactDetails();
  education?: BilingualText = new BilingualText();
  lifeStatus?: string = undefined;
  maritalStatus?: BilingualText = new BilingualText();
  personType?: string = undefined;
  specialization?: BilingualText = new BilingualText();
  userPreferences?: UserPreference = new UserPreference();
}
