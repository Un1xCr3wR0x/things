/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { BankAccount } from './bank-account';

export interface DependentValidatorDetails {
  actionType: string;
  age: number;
  bankAccount: BankAccount;
  benefitEndDate: GosiCalendar;
  benefitStartDate: GosiCalendar;
}

export interface BenefitStartDate {
  benefitStartDate: GosiCalendar;
  benefitEligibilityDate: GosiCalendar;
}
