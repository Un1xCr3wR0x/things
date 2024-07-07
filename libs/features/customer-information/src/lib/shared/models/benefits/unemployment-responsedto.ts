/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EligiblePeriods } from './benefits';

export class UnemploymentResponseDto {
  appealReason: BilingualText;
  contributorId: number;
  contributorName: BilingualText;
  eligibleMonths: number;
  nin: number;
  age: number;
  dateOfBirth: GosiCalendar;
  personId: number;
  requestDate: GosiCalendar;
  terminationDate: GosiCalendar;
  terminationReason: BilingualText;
  type: BilingualText;
  reasonDescription: string;
  selectedEligiblePeriod;
  constructor() {}
}
