/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EngagementDetails } from './engagement-details';
import { EngagementPeriod } from '@gosi-ui/features/contributor';

/**
 * Wrapper class for search contributor api response
 */
export class SearchEngagementResponse {
  activeEngagements: EngagementDetails[] = [];
  overallEngagements: EngagementDetails[] = [];
  totalContributionDays?: number;
  totalRPAContributionMonths?: number; //Aggregate Contribution
  totalVicContributionDays?: number;
  pendingContractsCount?: number;
  totalCivilContributionMonths?: number;
  totalCivilContributionDays?: number;
  totalGOSIContributionDays?: number;
  totalGOSIContributionMonths?: number;
  totalMilitaryContributionMonths?: number;
  totalMilitaryContributionDays?: number;
  totalPpaGccContributionMonths?: number;
  totalPpaGccContributionDays?: number;
  totalLumpSumsPaidMonths?: number;
  totalLumpSumsPaidDays?: number;
  totalGosiContributionMonths?: number;
  totalGosiContributionDays?: number;
  overallContributionMonths?: number;
  overallContributionDays?: number;
  totalRegularContributionMonths?: number;
  totalRegularContributionDays?: number;
  totalVicContributionMonths?: number;
  totalPpaContributionMonth?: number;
  averageGosiWage?: number = undefined;
  ppaStartDate?:GosiCalendar = new GosiCalendar();
  ppaEndDate?:GosiCalendar = new GosiCalendar();
  gosiStartDate?:GosiCalendar = new GosiCalendar();
  gosiEndDate?:GosiCalendar = new GosiCalendar();
  wageBreakPeriod?: EngagementPeriod;
  schemeType?: string;
  age?: number;
  aggregationRequestFSExist?: boolean;
  activeInPPA?: boolean;
  overlapBetweenGosiAndPPA?: boolean;
  aggregationRequestLSExist?: boolean;
  isHavingInprogressTransaction?: string;
  aggregationRequestLSDate?: string;
  appointmentNumber?: any;
  appointmentDate?:GosiCalendar = new GosiCalendar();
  aggregationRequestId?:number;
  eligibleForCancelAggregation?:boolean;
  cancellationContribution?:number;
  cancellationWage?:number;
  cancellationReason?: BilingualText = new BilingualText();
  cancellationRequestId?: number;
  dataSourceCompletionStatus?: boolean;
}
