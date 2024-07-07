/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { PersonDetails } from './person-details';
import { BenefitPaymentDetails, PersonBankDetails } from '.';
import { BilingualText, ContactDetails } from '@gosi-ui/core';

export class MiscellaneousPaymentRequest {
  agentType?: BilingualText;
  agentId?: number;
  agentIdentifier: number;
  netAmount: number;
  benefitList: BenefitPaymentDetails[];
  bankAccountId: number;
  bankAccountList: PersonBankDetails[];
  newIban: boolean;
  person: PersonDetails;
  contactDetail?: ContactDetails;
}
