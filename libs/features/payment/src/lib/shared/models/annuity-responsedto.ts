/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, GosiCalendar, Iqama, NIN, NationalId, Passport } from '@gosi-ui/core';
import { AdditionalContributionResponse } from '.';
import { BenefitPaymentsDetails } from './benefit-payments-details';
import { DependentDetails } from './dependent-details';
import { ImprisonmentPeriod } from './imprisonment-periods';
import { LateRequestDetails } from './late-request-benefit';

export class AnnuityResponseDto {
  additionalContribution: AdditionalContributionResponse;
  benefitType: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitPaymentDetails: BenefitPaymentsDetails;
  contributionMonthsToBeCredited: number;
  currentBenefitAmount: number;
  contributorId: number;
  contributorName: BilingualText;
  dateOfBirth: GosiCalendar;
  gender: BilingualText;
  payeeType: BilingualText;
  paymentMethod: BilingualText;
  occupation: BilingualText;
  personId: number;
  personWithoutIdentifier?: boolean;
  age: number;
  benefitAmount: number;
  nin: number;
  requestDate: GosiCalendar;
  notificationDate: GosiCalendar;
  disabilityDate: GosiCalendar;
  terminationDate: GosiCalendar;
  terminationReason: BilingualText;
  heirBenefitReason: BilingualText;
  missingDate: GosiCalendar;
  nextAssessmentDate: GosiCalendar;
  deathDate: GosiCalendar;
  type: BilingualText;
  dependents: DependentDetails[];
  disabled: BilingualText;
  finalBenefitAmount: number;
  helperAllowanceAmount: number;
  helperNeeded: BilingualText;
  status: BilingualText;
  imprisonmentPeriod?: ImprisonmentPeriod;
  enabledRestoration?: Boolean;
  isReturnEligible: boolean;
  isEnableReturnEligible: boolean;
  disabilityPercentage: number;
  lateRequestDetails: LateRequestDetails;
  lumpsumBenefitType: BilingualText;
  reasonForHold: BilingualText;
  holdStartDate: GosiCalendar;
  notes: string;
  actionType: string;
  beneficiaryBenefitStatus: BilingualText;
  waiveStartDate: GosiCalendar;
  waiveStopDate: GosiCalendar;
  totalAnnuityContributionMonths: number;
  amw: number;
  dependentAmount?: number;
  finalAvgWage?: number;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  constructor() {}
}
