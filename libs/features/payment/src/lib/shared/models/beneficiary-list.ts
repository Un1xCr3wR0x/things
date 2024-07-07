import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class BeneficiaryList {
  beneficiaryBenefitList: BenefitDetails[];
}

export class BenefitDetails {
  sourceId: number;
  source: BilingualText;
  startDate: GosiCalendar;
  stopDate: GosiCalendar;
  benefitType: BilingualText;
  benefitRequestDate?: GosiCalendar;
  benefitRequestStatus: BilingualText;
  workflowStatus?: number;
  benefitAmount: number;
  basicBenefitAmount: number = undefined;
  deathGrantComponentAmount: number = undefined;
  dependentComponentAmount: number = undefined;
  helperComponentAmount: number = undefined;
  initialBenefitAmount: number = undefined;
  subsequentBenefitAmount: number = undefined;
  totalBenefitAmount: number = undefined;
  deductionAmount: number = undefined;
  benefitAmountAfterDeduction: number = undefined;
  beneficiaryId?: number;
  beneficiaryBenefitId?: number;
  benefitStatus?: BilingualText;
  eligibleForPensionReform: boolean;
}
export class SaveAdjustmentResponse {
  adjustmentModificationId: number;
  referenceNo: number;
  adjustmentRepayId?: number;
}
export class AdjustmentRequest {
  actionType: BilingualText;
  adjustmentAmount: number;
  adjustmentId: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  benefitType: BilingualText;
  notes: string;
  adjustmentPercentage: number;
  rejectionReason: string;
  beneficiaryBenefitId?: number;
  beneficiaryId?: number;
}

export class AdjustmentRepay {
  adjustmentId: number;
  adjustmentAmount?: number;
  benefitType: BilingualText;
  beneficiaryBenefitId?: number;
}
export class BenefitItems {
  benefitAmount?: BilingualText;
  beneficiaryId?: number;
  benefitRequestStatus: BilingualText;
  benefitStatus: BilingualText;
  benefitStartDate: Date;
  benefitEndDate?: Date;
  benefitRequestDate?: Date;
  initialBenefitAmount?: BilingualText;
  subsequentBenefitAmount?: BilingualText;
  isBenefitTypeSaned?: Boolean;
}
