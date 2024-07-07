/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EligiblePeriods } from './benefits';
import { PersonBankDetails } from './person-bank-details';

export class UnemploymentResponseDto {
  appealReason: BilingualText;
  contributorId: number;
  contributorName: BilingualText;
  eligibleMonths: number;
  noContributionMonths: number;
  nin: number;
  age: number;
  ageInGregorian: number;
  dateOfBirth: GosiCalendar;
  personId: number;
  requestDate: GosiCalendar;
  benefitStartDate?: GosiCalendar;
  terminationDate: GosiCalendar;
  terminationReason: BilingualText;
  type: BilingualText;
  status?: BilingualText;
  reasonDescription: string;
  selectedEligiblePeriod;
  reasonForSuspension?: BilingualText;
  suspensionDate?: GosiCalendar;
  bankAccount?: PersonBankDetails;
  directPayment?: boolean;
  pensionReformEligibility?: BilingualText;
  constructor() {}
}
