/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, ContactDetails, Iqama, NationalId, NIN, Passport, Name } from '@gosi-ui/core';
import { AdjustmentDetails } from './adjustment-details';
import { AttorneyDetailsWrapper } from './attorney-details-wrapper';
import { PersonBankDetails } from './person-bank-details';

export class HeirsDetails {
  adjustments?: AdjustmentDetails[];
  attorneyDetails?: AttorneyDetailsWrapper;
  authorizationDetailsId: number = undefined;
  authorizedPersonId: number = undefined;
  authorizedPersonIdentity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  authorizedPersonName: BilingualText = new BilingualText();
  name?: BilingualText = new BilingualText();
  bankAccount: PersonBankDetails = new PersonBankDetails();
  contactDetail: ContactDetails = new ContactDetails();
  guardianPersonId?: number;
  guardianPersonName?: Name = new Name();
  guardianPersonIdentity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  payeeType: BilingualText = new BilingualText();
  payeeTypeValue?: string;
  paymentMode: BilingualText = new BilingualText();
  paymentModeValue?: string;
  personId: number = undefined;
  relationship?: BilingualText = new BilingualText();
  totalAdjustmentAmount: number;
  netPreviousAdjustmentAmount: number;
  netAdjustmentAmount: number;
  isDirectPaymentOpted?: boolean;
  debit?: boolean;
}
