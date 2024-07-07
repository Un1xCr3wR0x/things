/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  GosiCalendar,
  ContactDetails,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber
} from '@gosi-ui/core';
import { HoldPensionDetails } from './hold-pension-details';
import { PersonBankDetails } from './person-bank-details';

export class BenefitPaymentDetails {
  message?: BilingualText = new BilingualText();
  pension?: HoldPensionDetails;
  authorizedPersonId: number;
  authorizedPersonIdentifier = [];
  personIdentifier?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  authorizedPersonName: BilingualText;
  bankAccount?: PersonBankDetails;
  bankName: BilingualText;
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber>;
  contactDetail?: ContactDetails;
  finalBenefitAmount: number;
  iban: string;
  lastUpdatedOn: GosiCalendar;
  personId: number = undefined;
  referenceNo: number = undefined;
  payeeType: BilingualText;
  paymentMethod?: BilingualText;
  paymentMode?: BilingualText;
  samaVerification?: BilingualText = new BilingualText();
  account?: any;
}
