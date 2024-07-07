/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { DependentCalcDetails, HeirsDetails, RestartHoldDetails, AttorneyDetailsWrapper, AssessmentDetails } from '.';
import { AdjustmentDetails } from './adjustment-details';
import { Contributor } from './contributor';
import { HoldPensionDetails } from './hold-pension-details';

export class HoldBenefitDetails {
  contributor: Contributor;
  reason: BilingualText;
  requestDate: GosiCalendar;
  notes: string;
  holdDetails?: RestartHoldDetails;
  modifyPayee?: HeirsDetails;
  pension: HoldPensionDetails;
  adjustments?: AdjustmentDetails[];
  dependentAmounts?: DependentCalcDetails[];
  benefitAttorney?: AttorneyDetailsWrapper;
  warningMessage?: BilingualText = new BilingualText();
  debit?: boolean;
  isPreviousAdjustmentAmountDebit?: boolean;
  deathDate?: GosiCalendar;
  eventDate?: GosiCalendar;
  holdStartDate?: GosiCalendar;
  benefitRestartDate?: GosiCalendar;
  benefitStartDate?: GosiCalendar;
  isDirectPaymentOpted: boolean;
  totalAdjustmentAmount: number;
  netPreviousAdjustmentAmount: number;
  netAdjustmentAmount: number;
  samaVerification?: BilingualText = new BilingualText();
  assessmentDetails?: AssessmentDetails;
  personId?: number;
  pensionReformEligibility?: boolean;
}
