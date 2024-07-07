/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, ContactDetails } from '@gosi-ui/core';
import { BankAccountList } from './bank-account-list';
import { BenefitPaymentDetails } from './benefit-payment-details';
import { PersonDetails } from './person-details';

export class MiscellaneousPayment {
  agentId: number;
  agentIdentifier: string;
  agentType: BilingualText;
  bankAccountList: BankAccountList[];
  benefitList: BenefitPaymentDetails[];
  netAmount: number;
  person: PersonDetails;
  contactDetail?: ContactDetails = new ContactDetails();
}

export class PatchPaymentResponse {
  message: BilingualText;
  referenceNo: number;
}
