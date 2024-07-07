/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class InjuryDetails {
  assessmentDate: GosiCalendar;
  disabilityType?: BilingualText;
  assessmentId: number;
  injuryId: number;
  assessmentType: BilingualText;
  assessmentResult: BilingualText;
  disabilityPercentage: number;
  helperRequired: BilingualText;
  helperStartDate: GosiCalendar;
  nextAssessmentDate: GosiCalendar;
  type?: BilingualText = new BilingualText();
  result?: BilingualText = new BilingualText();
  disabilityDate?: GosiCalendar = new GosiCalendar();
  helperNeeded?: BilingualText = new BilingualText();
  helperDate?: GosiCalendar = new GosiCalendar();
  nextDate?: GosiCalendar = new GosiCalendar();
  conveyance?: number;
  canAccept?: boolean;
  canAppeal?: boolean;
  raiseAppeal?: boolean;
  accepted?: boolean;
  recordStatus?: string;
  identifier: string;
  personId?: number;
  isAssessment?: boolean;
  mbAssessmentReqId: number;
  benefitReqId?:number;
}

export class DisabilityTimeline {
  assessmentDetails: InjuryDetails[];
}
