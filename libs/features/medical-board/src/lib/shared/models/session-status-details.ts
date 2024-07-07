import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { MedicalBoardList, ParticipantsList } from './medical-board-list';
import { AlllowedParticipants } from './allowed-participant';
import { AllowedSpecialityList } from './allowed-speciality';

export class SessionStatusDetails {
  endTime: string;
  maximumBeneficiaries: number;
  mbList: MedicalBoardList[] = [];
  participantList: ParticipantsList[] = [];
  allowedSpecialityList: AllowedSpecialityList[] = [];
  medicalBoardType: BilingualText = new BilingualText();
  noOfDoctorsInvited: number;
  noOfDoctorsAccepted: number;
  noOfParticipants: number;
  allowedParticipantMap: AlllowedParticipants[] = [];
  officeLocation: BilingualText = new BilingualText();
  sessionDate: GosiCalendar = new GosiCalendar();
  sessionType: BilingualText = new BilingualText();
  startTime: string;
  status: BilingualText = new BilingualText();
  totalNoOfMBRecords: number;
  totalNoOfParticipantRecords: number;
  fieldOfficeCode: number;
  isAmbUser: number;
  holdReason: BilingualText = new BilingualText();
  startTimeAmOrPm: BilingualText;
  endTimeAmOrPm: BilingualText;
  isParticipantInProgress? = false;
  sessionModifiable?: boolean;
}
