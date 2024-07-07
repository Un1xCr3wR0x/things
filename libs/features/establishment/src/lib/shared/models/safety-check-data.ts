/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class SafetyCheckData {
  allSubmissions: SubmittedCheckList[];
  currentOhRate: string;
  establishmentName: BilingualText;
  gracePeriodEndDate: GosiCalendar;
  latestSubmissions: SubmittedCheckList;
  registrationNo: number;
  remainingGracePeriod: number;
  selfEvaluationReason: string;
  submissionDate: GosiCalendar;
  totalGracePeriod: number;
  comments: string;
}

export class SubmittedCheckList {
  referenceNumber: number;
  requestSubmissionDate: GosiCalendar;
  establishmentSafetyViolations: AdminSelectedCheckList[];
}

export class AdminSelectedCheckList {
  addictionInfoList: AdminSelectedAddInfo[];
  guideLineName: BilingualText;
  guidelineId: number;
  shownInReport: boolean;
}

export class AdminSelectedAddInfo {
  additionalInfoId: number;
  additionalInfoType: BilingualText;
  additionalInfoValue: string;
  infoUnit: string;
}
