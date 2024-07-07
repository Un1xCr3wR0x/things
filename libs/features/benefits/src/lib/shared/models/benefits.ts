/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EligibilityResponse } from './eligibility-response';
import { ImprisonmentDetails } from './imprisonment-details';

export class Benefits {
  lateRequest: boolean;
  benefitId: number;
  benefitType: BilingualText;
  benefitGroup: BilingualText;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  status: string;
  eligibilityRules: EligibilityResponse[];
  failedEligibilityRules: number;
  totalEligibilityRules: number;
  eligible: boolean;
  appeal: boolean;
  jailedPeriods: ImprisonmentDetails[];
  deathDate: GosiCalendar;
  missingDate: GosiCalendar;
  heirBenefitRequestReason: BilingualText;
  warningMessages: BilingualText[];
  eligiblePeriods: EligiblePeriods[];
  eligibleForDependentAmount: boolean;
  eligibleForVicCancellation: boolean;
  refundVicContribution: boolean;
  retirementEligibility: RetirementEligibility;
  applicable?: boolean;
  isReopen?: boolean = false;
  hasActiveCommercialRegistry?: boolean = false;
  hasCredAdjustment?: BilingualText;
  contMonthsBought: boolean;
  eligibleForAnnuity: boolean;
  eligibleForOH: boolean;
  eligibleForPensionReform: boolean;
  isPpaOhDeath: boolean;
}

export interface EligiblePeriods {
  endDate: GosiCalendar;
  startDate: GosiCalendar;
}

export interface RetirementEligibility {
  message: BilingualText;
  eligibleForRetirementBenefit: boolean;
}
export class SystemParameter {
  OLD_LAW_DATE: Date = new Date();
}

export class SimisBenefit {
  benefitType: BilingualText;
  benefitAmount: number;
  previousDueIndicator?: string = '--'; // can be null
  debitBalance?: number = 0; // can be null!!
  creditBalance: number;
  totalPension: number;
  effectiveDate: GosiCalendar;
  paymentDate: GosiCalendar;
  paymentMethod: BilingualText;
  authorizedPersonName?: string = '--'; // can be null;
  bankAccountNumber?: string = '--'; // can be null;
  chequeNumber?: string = '--'; // can be null
  paymentStatus: BilingualText;
}

export class MainframeBenefit {
  payeeName: string;
  issuedDate: GosiCalendar;
  draftNumber: number;
  payeeCode: number;
  bankAccountNumber: string;
  draftStatus: string = '--';
  cycleDate: GosiCalendar;
  noOfMonths: number;
  basicAmount: number;
  repaymentDate: number;
  adjustmentAmount: number;
  adjustmentCode: number;
  netAmount: number;
}
export class SimisSanedPaymentHistory{
  uiSimisPaymentHistoryItems: UiSimisPaymentHistoryItemsDto[];
}

export class UiSimisPaymentHistoryItemsDto {
  sanedType: BilingualText;
  benefitDate: GosiCalendar;
  paymentDate: GosiCalendar;
  adjustmentAmount: number;
  creditBalance: number;
  fieldOffice: BilingualText;
  IBAN: string;
  sanedBenefitStatus: BilingualText;
  reasonForLastChange: BilingualText;
}
