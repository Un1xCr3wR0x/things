/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdjustmentHistoryDetail } from './adjustment-history-detail';
import { ModificationDetails } from './modification-details';
import { CancellationDetails } from './cancellation-details';

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
  benefitRequestId?: number;
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
  sin?: number;
  isStop?: Boolean = false;
  statusChange?: Boolean = false;
  referenceNo?: number;
  eligibleForPensionReform?: boolean;
  isViewAdjustment?: boolean;
  isEditAdjustment?: boolean;
  isModifyCancelAdjustment?: boolean
}
