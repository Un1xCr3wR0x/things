/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class EngagementInfo {
  engagements: Engagements[];
}
export class Engagements {
  approvalDate: GosiCalendar = new GosiCalendar();
  approvalStatus: string;
  backdatingIndicator: Boolean;
  cancellationReason: string;
  companyWorkerNumber: any;
  contractWorkflow: any[];
  engagementDuration: PeriodDifference;
  engagementId: number;
  engagementPeriod: EngagementPeriod[];
  engagementType: string;
  establishmentLegalEntity: BilingualText;
  establishmentName: BilingualText;
  establishmentStatus: BilingualText;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  gccEstablishment: Boolean;
  hasActiveBranchesInGroup: Boolean;
  isContractsAuthRequired: Boolean;
  joiningDate: GosiCalendar = new GosiCalendar();
  lastModifiedTimeStamp: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: any;
  molEstablishmentId: any;
  molEstablishmentOfficeId: any;
  molOfficeId: any;
  molunId: any;
  ownerNin: any;
  penaltyIndicator: Boolean;
  pendingTransaction: any[];
  prisoner: Boolean;
  proactive: Boolean;
  purposeOfRegistration: any;
  recruitmentNumber: Number;
  registrationNo: Number;
  status: String;
  student: Boolean;
  vicIndicator: Boolean;
  workType: BilingualText;
  isSelected?: Boolean;
  alreadyAdded?: Boolean;
  isFullyCancelled?: Boolean;
  benefitIndicator: Boolean;
}
export class PeriodDifference {
  noOfMonths: number = undefined;
  noOfDays: number = undefined;
}
export class EngagementPeriod {
  contributorAbroad = Boolean;
  coverageType: BilingualText;
  effectiveEndDate: GosiCalendar;
  effectiveStartDate: GosiCalendar;
  endDate: GosiCalendar;
  id: Number;
  lastUpdatedDate: GosiCalendar;
  occupation: BilingualText;
  periodDuration: PeriodDifference;
  product: any;
  startDate: GosiCalendar;
  wage: Wage;
}
export class Wage {
  basicWage: Number;
  commission: Number;
  contributoryWage: Number;
  housingBenefit: Number;
  otherAllowance: Number;
  status: Number;
  totalWage: Number;
  wageType: Number;
}
