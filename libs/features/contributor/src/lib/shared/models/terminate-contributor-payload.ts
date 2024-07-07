/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText, BankAccount } from '@gosi-ui/core';

export class TerminateContributorPayload {
  editFlow: boolean = undefined;
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  comments: string = undefined;
  uuid?: string;
  bankAccount?: BankAccount; //For terminate VIC
  secondmentDetails?: SecondmentDetailsDto;
  studyLeaveDetails?: StudyLeaveDetailsDto;
}

export class SecondmentDetailsDto {
  secondmentEndDate: GosiCalendar = new GosiCalendar();
  secondmentStartDate: GosiCalendar = new GosiCalendar();
  establishmentType: BilingualText = new BilingualText();
  establishmentId: number = 0;
  establishmentName?: BilingualText = new BilingualText();
}

export class StudyLeaveDetailsDto {
  studyLeaveEndDate?: GosiCalendar = new GosiCalendar();
  studyLeaveStartDate: GosiCalendar = new GosiCalendar();
  certification: BilingualText = new BilingualText();
  studyingAbroad: boolean = undefined;
}