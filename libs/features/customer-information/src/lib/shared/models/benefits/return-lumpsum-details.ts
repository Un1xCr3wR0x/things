/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdditionalContributionResponse } from './additional-contribution-response';
import { DependentValidatorDetails } from './dependents';
import { ReturnLumpsumPaymentDetails } from './return-lumpsum-payment-details';

export class ReturnLumpsumDetails {
  additionalContribution: AdditionalContributionResponse;
  age: number;
  ageInGregorian: number;
  benefitAmount: number;
  benefitStartDate: GosiCalendar;
  benefitType: BilingualText;
  contributionMonthsToBeCredited: number;
  contributorId: number;
  contributorName: BilingualText;
  dateOfBirth: GosiCalendar;
  dependents: DependentValidatorDetails;
  enableLumpsumRepaymentId: number;
  enabledRestoration: Boolean;
  isEnableReturnEligible: Boolean;
  isReturnEligible: Boolean;
  notesForEnableRestoration: string;
  nin: number;
  requestDate: GosiCalendar;
  reasonForEnableRestoration: BilingualText;
  repaymentDetails: ReturnLumpsumPaymentDetails;
  payeeType: BilingualText;
  paymentMethod: BilingualText;
}
