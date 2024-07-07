/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class MiscellaneousPaymentRequest {
  netAmount: number;
  benefitList: BenefitPaymentDetails[];
  bankAccountId: number;
  bankAccountList: NewBankAccount[];
  newIban: boolean;
  person: PersonDetails;
}
class BenefitPaymentDetails {
  adjustedAmount: number;
  adjustmentList: BenefitPaymentAdjustment[];
  benefitType: BilingualText;
  startDate: GosiCalendar;
  status: BilingualText;
  stopDate: GosiCalendar;
}
class BenefitPaymentAdjustment {
  adjustmentAmount: number;
  adjustmentReason: BilingualText;
  paymentType: BilingualText;
  percentage: number;
  startDate: GosiCalendar;
}
class PersonDetails {
  identity: Identity[];
  birthDate: GosiCalendar;
  name: BilingualText = new BilingualText();
  nameBilingual: BilingualText;
  age: Number;
}
class NewBankAccount {
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  ibanBankAccountNo: string;
  isNonSaudiIBAN?;
}

class Identity {
  idType: string;
  newNin: number;
}
