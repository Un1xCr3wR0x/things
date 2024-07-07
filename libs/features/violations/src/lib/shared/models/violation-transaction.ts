import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BenefitInfo } from './benefit-info';
import { ContributorDetails } from './contributor-details';
import { EstablishmentInfo } from './establishment-info';
import { InspectionInfo } from './inspection-info';
import { ModifiedDecisions } from './modified-decisions';
import { PenaltyDetails } from './penalty-details';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ViolationTransaction {
  assignedCommittee: BilingualText;
  contributors: ContributorDetails[];
  dateReported: GosiCalendar = new GosiCalendar();
  establishmentInfo: EstablishmentInfo;
  existingTransactionAvailable: string;
  existingTransactionId: number;
  fieldActivityNo: string;
  index?: number;
  inspectionInfo: InspectionInfo;
  isSimisViolation: boolean;
  modifiedDecisions: ModifiedDecisions[];
  penaltyAmount: number = undefined;
  penaltyInfo: PenaltyDetails[];
  referenceNo: string;
  repeatedViolation: boolean;
  repetitionCount: number;
  violationClass: BilingualText = new BilingualText();
  violationDescription: string;
  violationId: number;
  violationStatus: BilingualText = new BilingualText();
  violationType: BilingualText;
  violationTypeForRased: string;
  totalContributionAmount?: number = undefined;
  numberOfContributorsAffected: number;
  violationLetterDate: GosiCalendar = new GosiCalendar();
  showSaveError?: boolean;
  discoveredAfterInspection?: BilingualText = new BilingualText();
  violationReferenceNumber?: number;
  transactionSubmittedDate?: GosiCalendar;
  manualViolation?: boolean;
  benefitInfo?: BenefitInfo[];
  hasAppealRequest: boolean;
  transactionDate: string;
}
