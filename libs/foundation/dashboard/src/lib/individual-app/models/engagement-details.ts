/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, WageInfo } from '@gosi-ui/core';
import { CoveragePeriod } from './coverage-period';
export class OverallEngagementResponse {
  engagements: EngagementDetails[] = [];
  activeEngagements: EngagementDetails[] = [];
}
/** The wrapper class for engagement details. */
export class EngagementDetails {
  backdatingIndicator = false;
  companyWorkerNumber: string = undefined;
  contributorAbroad = false;
  engagementId: number = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  isContractsAuthRequired = false;
  lastModifiedTimeStamp: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  proactive = false;
  engagementPeriod: EngagementPeriod[] = [];
  actualEngagementPeriod: EngagementPeriod;
  status: string = undefined;
  student = false;
  workType: BilingualText = new BilingualText();
  engagementDuration: PeriodDifference = new PeriodDifference();
  engagementType: string = undefined;
  //Added for change engagement module
  //Added for unified profile
  registrationNo?: number;
  socialInsuranceNo?: number;
  gccEstablishment?: boolean;
  hasActiveBranchesInGroup?: boolean;
  establishmentName?: BilingualText;
  establishmentStatus?: BilingualText;
  coverageDetails?: CoveragePeriod;
  vicIndicator: boolean;
  ppaIndicator: boolean;
}
export class EngagementPeriod {
  id: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  occupation: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  wage: WageInfo = new WageInfo();
  minDate: Date = new Date();
  monthlyContributoryWage: number = undefined;
  lastUpdatedDate: GosiCalendar = new GosiCalendar();
  coverageType: BilingualText[] = [];
  coverage: BilingualText = new BilingualText();
  editFlow = false;
  wageDetailsUpdated? = false; //Flag to check whether wage is updated or not
  // periodDuration: PeriodDifference = new PeriodDifference();
  contributorAbroad = false;
  canEdit = false;
  isSplit = false; //Flag to indicate whether period is split
  uuid: string = undefined;
  comments?: string;
}
export class PeriodDifference {
  noOfMonths: number = undefined;
  noOfDays: number = undefined;
  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      this[key] = json[key];
    });
    return this;
  }
}
