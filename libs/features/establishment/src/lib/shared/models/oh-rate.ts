/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { InspectionDetails } from './inspection-details';
import { OHRateHistory } from './oh-rate-history';

export class OHRate {
  currentOhRate: number;
  disableReInspection: boolean;
  applicableRates: number[];
  ohRateHistory: OHRateHistory[];
  compliant: boolean;
  inspectionReferenceNumber?: string;
  effectiveStartdate?: GosiCalendar;
  baseRate = 2;
  latestInspectionEntity: InspectionDetails;
  sameMonthRequest: boolean;
  ohRateConsecutiveFour: boolean;
  punishmentPeriodEndDate: GosiCalendar;
  inspectionId: number;
  scSelfEvaluationTransactionId?: number;
}
