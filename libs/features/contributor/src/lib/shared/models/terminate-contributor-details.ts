/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { SecondmentDetailsDto, StudyLeaveDetailsDto } from './terminate-contributor-payload';

export class TerminateContributorDetails {
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  terminationType: string = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  secondmentDetails?: SecondmentDetailsDto;
  studyLeaveDetails?: StudyLeaveDetailsDto;
  secondment?: boolean;
  studyLeave?: boolean;
  formSubmissionMonthDifference?: number = undefined;
}
