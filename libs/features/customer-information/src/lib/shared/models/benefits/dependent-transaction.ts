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
  dependentAmount: number;
  dependentAmountPercentage: number;
  dependentDetails: DependentsDetails;
  dependentsDetails: DependentsDetails[] = [];
  helperAllowanceDetails: HelperAllowanceDetails;
  noOfMonths: number;
  totalBenefitAmount: number;
  heirDetails?: HeirHistoryDetails[];
  heirHistoryDetails?: HeirHistoryDetails;
}

export class HelperAllowanceDetails {
  allowanceAmount: number;
  allowanceEndDate: GosiCalendar;
  allowanceStartDate: GosiCalendar;
}
