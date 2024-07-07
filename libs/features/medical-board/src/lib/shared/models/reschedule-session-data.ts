import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { RescheduleSessionList } from '.';
import { ParticipantList } from './contracted-members copy';

export class RescheduleSessionData {
  mbList: RescheduleSessionList[];
  mboDetails: MboDetails;
  totalNoOfRecords: number;
  medicalBoardType: BilingualText;
  officeLocation: BilingualText;
  sessionType: BilingualText;
  sessionDate: GosiCalendar = new GosiCalendar();
  startTime: string;
  endTime: string;
  canAmbRemove?: boolean;
  canPmbRemove?: boolean;
  startTimeAmOrPm: BilingualText;
  endTimeAmOrPm: BilingualText;
  participantList: ParticipantList[];
  maximumBeneficiaries?: number;
  totalNoOfParticipantRecords?: number;
  sessionStarted:boolean;
}
export class MboDetails {
  email: string;
  longNameArabic: string;
  mobile: number;
  preferredLanguage: BilingualText;
  userlocation: string;
  userlocationBilingual: BilingualText;
  userreferenceid: string;
}
