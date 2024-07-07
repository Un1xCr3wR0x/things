/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ParticipantsDetails {
  count: number;
  pageNo: number;
  participantPrimarySpecialityCount: Array<{ [key: string]: number }>;
  participantsList: AddParticipantsList[];
  availableSessionInfoBySpeciality: AvailableSession[];
  allSessions: boolean;
}
export class AvailableSession {
  sessionTime: string;
  sessionDate: GosiCalendar = new GosiCalendar();
  location: BilingualText = new BilingualText();
  maximumBeneficiaries: number = undefined;
  filledBeneficiaries: number = undefined;
  listOfSpeciality: BilingualText[] = [];
  sessionId: number = undefined;
  tempId: number = undefined;
  medicalBoardType: BilingualText = new BilingualText();
  specialityId: number = undefined;
  subSpecialityId: number = undefined;
}
export class AddParticipantsList {
  assessmentType: BilingualText = new BilingualText();
  contractId: number = undefined;
  contractType: BilingualText = new BilingualText();
  disabilityType: BilingualText = new BilingualText();
  doctorName: BilingualText = new BilingualText();
  identity: number | string = undefined;
  mbAssessmentRequestId: number = undefined;
  identityNumber: string = undefined;
  inviteeId: number = undefined;
  isAvailable: boolean;
  isdCode: string;
  isReassessment: boolean;
  location: BilingualText;
  mbProfessionalId: number = undefined;
  memberType: BilingualText = new BilingualText();
  mobileNumber: string;
  name: BilingualText = new BilingualText();
  nationalIdType: string;
  noOfDaysInQueue: number;
  participantId: number = undefined;
  participantType: BilingualText = new BilingualText();
  specialty: BilingualText;
  specialityId: number;
  subSpecialityId: number;
  subSpecialty: BilingualText[] = [];
  type: BilingualText = new BilingualText();
  isHide: boolean;
  medicalBoard: string;
  primarySpecialty: BilingualText[] = [];
  secondarySpecialty: BilingualText[] = [];
  createdTimeStamp: GosiCalendar = new GosiCalendar();
  sessionTime: string;
  sessionDate: string;
  isNoSpeciality = false;
  mbType: BilingualText = new BilingualText();
  fieldOffice: BilingualText = new BilingualText();
  participantAttendance: BilingualText = new BilingualText();
}
