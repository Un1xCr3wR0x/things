/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { SingleDependent } from './dependent-single-transaction';
import { DependentsDetails } from './dependent-multiple-transaction';
import { HeirHistoryDetails } from '.';

export class DependentHistoryDetails {
  dependentsDetails: DependentTransaction[];
}

export class DependentTransaction {
  dateFrom: GosiCalendar;
  dateTo: GosiCalendar;
  statusDate: GosiCalendar;
  helperAllowanceAmount: number;
  dependentAmount: number;
  dependentAmountPercentage: number;
  dependentDetails: DependentsDetails;
  dependentsDetails: DependentsDetails[] = [];
  helperAllowanceDetails: HelperAllowanceDetails;
  noOfMonths: number;
  daysInBenefitPeriod: number;
  totalBenefitAmount: number;
  heirDetails?: HeirHistoryDetails[];
  heirHistoryDetails?: HeirHistoryDetails;
  benefitStartDate?: GosiCalendar;
  nullified?: boolean;
}

export class HelperAllowanceDetails {
  allowanceAmount: number;
  allowanceEndDate: GosiCalendar;
  allowanceStartDate: GosiCalendar;
}
