import {
  BilingualText,
  GosiCalendar,
  ContactDetails,
  Name,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber
} from '@gosi-ui/core';

import { Contracts } from './contract';
import { BankDataDetails } from '../../shared';

export class MbProfile {
  nationality: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: Name = new Name();
  sex: BilingualText = new BilingualText();
  birthDate: GosiCalendar = new GosiCalendar();
  maritalStatus: BilingualText;
  contactDetail: ContactDetails = new ContactDetails();
  prisoner: boolean;
  student: boolean;
  proactive: boolean;
  bankAccount: BankDataDetails;
  personId: number;
  contracts: Contracts[] = new Array<Contracts>();
  govtEmployee: boolean;
}
