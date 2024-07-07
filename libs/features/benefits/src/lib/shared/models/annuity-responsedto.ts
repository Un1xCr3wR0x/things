/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  BorderNumber,
  CommonIdentity,
  GosiCalendar,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { AdditionalContributionResponse, BenefitPaymentDetails, DeathNotification, PersonBankDetails } from '.';
import { AdjustmentDetails } from './adjustment-details';
import { DependentDetails } from './dependent-details';
import { ImprisonmentPeriod } from './imprisonment-periods';
import { LateRequestDetails } from './late-request-benefit';

export class AnnuityResponseDto {
  additionalContribution: AdditionalContributionResponse;
  agentId: number;
  amw: number;
  annualNotificationDetails: AnnualNotificationDetails;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  identityValue?: CommonIdentity;
  isDecisionChange?: boolean;
  benefitType: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitStopDate: GosiCalendar;
  benefitBaseAmount: number;
  contributionMonths?: number;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  noContributionMonths: number;
  benefitPaymentDetails: BenefitPaymentDetails;
  contributionMonthsToBeCredited: number;
  currentBenefitAmount: number;
  contributorId: number;
  contributorName: BilingualText;
  certificateExpiryDate: GosiCalendar;
  authorizedPersonName: BilingualText;
  authorizedPersonIdentity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  dateOfBirth: GosiCalendar;
  gender: BilingualText;
  payeeType: BilingualText;
  paymentDetails?: PaymentDetails[];
  paymentMethod: BilingualText;
  occupation: BilingualText;
  personId: number;
  personWithoutIdentifier?: boolean;
  age: number;
  ageInHijiri: number;
  ageInGregorian?: number;
  benefitAmount: number;
  ineligibilityReasons?: BilingualText[];
  nin: number;
  requestDate: GosiCalendar;
  notificationDate: GosiCalendar;
  dependentAmount?: number;
  disabilityDate: GosiCalendar;
  terminationDate: GosiCalendar;
  terminationReason: BilingualText;
  heirBenefitReason: BilingualText;
  missingDate: GosiCalendar;
  nextAssessmentDate: GosiCalendar;
  nextPaymentDate?: GosiCalendar;
  deathDate: GosiCalendar;
  deathNotification?: DeathNotification;
  type: BilingualText;
  dependents: DependentDetails[];
  disabled: BilingualText;
  finalAverageWage?: number;
  finalBenefitAmount: number;
  helperAllowanceAmount: number;
  helperNeeded: BilingualText;
  status: BilingualText;
  injuryDate?: GosiCalendar;
  injuryId?: number;
  imprisonmentPeriod?: ImprisonmentPeriod;
  enabledRestoration?: Boolean;
  isDisabilityAfterTermination?: Boolean;
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
  totalContributionMonths?: number;
  totalPaidDependentAmount?: number;
  helperStartDate?: GosiCalendar;
  adjustments?: AdjustmentDetails[];
  totalAdjustmentAmount?: number;
  netPreviousAdjustmentAmount?: number;
  netAdjustmentAmount?: number;
  debit?: boolean;
  isHold?: boolean;
  isDirectPayment?: boolean;
  modificationRequestDate?: GosiCalendar;
  modifiedAnnualNotificationDate?: GosiCalendar;
  dependentComponents?: DependentComponents[];
  eligibleForDependentComponent?: boolean;
  lastEstablishmentRegNo?: number;
  injuryEstablishmentRegNo?: number;
  complicationId: number;
  disableValidatorEdit?: boolean;
  deathDatePresent: boolean;
  hasOverlappingEngagements?: boolean;
  hideBenefitDetails?: boolean;
  otherHoldReasons?: Array<BilingualText>;
  isOverseasBeneficiary: boolean;
  beneficiaryNationality: BilingualText;
  startDateGreaterThanStopDate: boolean;
  fcApproveDisable: boolean;
  multipleHeirAnnualNotification: boolean;
  bankAccount: PersonBankDetails;
  pensionReformEligibility: BilingualText;
  disabilityDescription?: string;
  isAppealed?: boolean;
  warningMessage?: BilingualText;
  resultPublished?: boolean;
  prevRejectedTransaction?:boolean;
  constructor() {}
}
class PaymentDetails {
  lastPaidDate?: GosiCalendar;
  paidMonths?: number;
  totalPaidAmount?: number;
  paidDependentComponent?: number;
}
export class DependentComponents {
  benefitComponentType?: BilingualText;
  benefitLastPaidDate?: GosiCalendar;
  benefitStartDate?: GosiCalendar;
  benefitStopDate?: GosiCalendar;
  benefitStopDateStr?: GosiCalendar;
  calculatedBenefitAmount: number;
  status?: BilingualText;
  totalBenefitAmount?: number;
}

export class AnnualNotificationDetails {
  nextNotificationDate: GosiCalendar;
  notes: string;
  notificationDate: GosiCalendar;
}
export class RequestModificationDateDetailsDto {
  requestModificationDate:GosiCalendar;
  referenceNo:number;
}
