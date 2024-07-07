import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AddParticipantsList } from './add-participants-list';
import { SessionHoldDetails } from './session-hold-details';
import { SessionSpecialityDetails } from './session-speciality-details';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class IndividualSessionDetails {
  beneficiarySlotOpenDays: number = undefined;
  days: BilingualText[];
  doctorDetails: SessionSpecialityDetails[];
  memberDetails: SessionSpecialityDetails[];
  participantList: AddParticipantsList[];
  doctorInviteCancelGraceDays: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  endTime: string;
  fieldOfficeCode: number = undefined;
  holdComments: string;
  holdDetails: SessionHoldDetails[];
  holdReason: BilingualText = new BilingualText();
  isAmbUser: boolean;
  isDoctorInviteCancelAllowed: boolean;
  maximumBeneficiaries: number = undefined;
  medicalBoardType: BilingualText = new BilingualText();
  minimumBeneficiaries: number = undefined;
  officeLocation: BilingualText = new BilingualText();
  sessionChannel: BilingualText = new BilingualText();
  sessionCreationGraceDays: number = undefined;
  sessionFrequency: BilingualText = new BilingualText();
  sessionTemplateId: number = undefined;
  sessionType: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  holdStartDate:GosiCalendar=new GosiCalendar();
  startTime: string;
  status: BilingualText = new BilingualText();
}
