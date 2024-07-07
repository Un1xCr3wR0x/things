/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdjustmentHistoryDetail } from './adjustment-history-detail';
import { ModificationDetails } from './modification-details';
import { CancellationDetails } from './cancellation-details';
import { PersonAdjustment } from './person-adjustment';

export class AdjustmentDetailsDto {
  adjustments: AdjustmentDetails[];
  totalAdjustmentAmount?: number;
}
export class AdjustmentDetails {
  adjustmentAmount: Number;
  adjustmentId: Number;
  adjustmentReason: BilingualText;
  adjustmentStatus: BilingualText;
  adjustmentType: BilingualText;
  createdDate: GosiCalendar;
  amount: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  reason: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
}

export class PersonAdjustmentDetails {
  adjustments: Adjustment[];
  person: PersonAdjustment;
  payAdjustmentEligible?: boolean;
  debit?: boolean;
  netAdjustmentAmount?: number;
  netMonthlyDeductionAmount?: number;
  netPreviousAdjustmentAmount?: number;
  netAdjustmentType?: BilingualText;
  recoveredAdjustmentAmount?: number;
  remainingAdjustmentAmount?: number;
}

export class Adjustment {
  actionType: BilingualText = new BilingualText();
  adjustmentId: number;
  createdDate: GosiCalendar;
  benefitType: BilingualText;
  benefitRequestDate: GosiCalendar;
  adjustmentType: BilingualText;
  adjustmentAmount: number;
  adjustmentBalance: number;
  adjustmentStatus: BilingualText;
  adjustmentReason: BilingualText;
  adjustmentReasons?: BilingualText[];
  dependentComponentAmount: number;
  helperComponentAmount: number;
  holdAdjustment: boolean;
  adjustmentPercentage: number;
  basicBenefitAmount: number;
  benefitStatus: BilingualText;
  adjustmentHistoryDetails?: AdjustmentHistoryDetail[];
  notes: string;
  benefitRequestStatus: BilingualText;
  benefitAmount: number;
  rejectionReason?: string;
  modificationDetails: ModificationDetails;
  cancellationDetails: CancellationDetails;
  //monthlyDeductionPercentage: number;//REMOVED As poer new contract
  monthlyDeductionAmount?: number;
  payeeName?: BilingualText;
  payeeId?: number;
  requestedBy?: BilingualText = new BilingualText();
  channel?: BilingualText = new BilingualText();
  continuousDeduction: boolean;
  totalBenefitAmount: number;
  transferMode: BilingualText = new BilingualText();
  caseDate: GosiCalendar = new GosiCalendar();
  holdAdjustmentReason?: BilingualText;
  stopAdjustmentReason?: BilingualText;
  reactivateAdjustmentReason?: BilingualText;
  otherReason?: string;
  caseNumber: number = undefined;
  city: BilingualText = new BilingualText();
  beneficiaryId?: number;
}

export class PaymentAndBenefitStatusDtos {
  holdBenefit: boolean;
  initiateDirectPayment: boolean;
  personId: number;
}

export class HeirAdjustments {
  personId: PersonAdjustmentDetails;
}
export class AdjustmentModification {
  eligible: boolean;
}
