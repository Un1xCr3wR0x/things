/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  BorderNumber,
  ContactDetails,
  GosiCalendar,
  Iqama,
  Name,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { BankAccDetails } from './bank-acc-details';

export class BeneficiaryBenefitDetails {
  benefitType: BilingualText;
  requestDate: GosiCalendar;
  notes: string;
  beneficiaryDetails: BeneficiaryBenefitDetail;

  constructor() {}
}
class BeneficiaryBenefitDetail {
  age: number;
  agentContactDetails: ContactDetails;
  authorizedPersonId: number;
  bankAccount: BankAccDetails;
  beneficiaryType: BilingualText;
  contactDetail: ContactDetails;
  dateOfBirth: GosiCalendar;
  deathDate: GosiCalendar;
  dependentSource: string;
  eventDate: GosiCalendar;
  existingIncome: number;
  expectedDob: GosiCalendar;
  guardianPersonId: number;
  heirStatus: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  income: number;
  maritalStatus: BilingualText;
  maritalStatusValue: string;
  monthlyWage: number;
  motherId: number;
  name: Name;
  notes: string;
  orphan: boolean;
  orphanDate: GosiCalendar;
  payeeType: BilingualText;
  payeeTypeValue: string;
  paymentMode: BilingualText;
  paymentModeValue: string;
  personId: number;
  reasonForModification: BilingualText;
  recordActionType: string;
  relationship: BilingualText;
  statusDate: GosiCalendar;
  statusDateSelectedFromUi: GosiCalendar;
  unborn: boolean;
}
