import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { SessionMemberDetails } from './session-member-details';
import { AddParticipantsList } from '../../shared';

export class RegisterMedicalSessionDetails {
  beneficiarySlotOpenDays: number;
  channel: BilingualText;
  days: BilingualText[];
  doctorInviteCancelGraceDays: number;
  endDate: GosiCalendar = new GosiCalendar();
  endTime: string;
  frequency: BilingualText;
  isDoctorInviteCancelAllowed: boolean;
  maximumBeneficiaries: number;
  medicalBoardType: BilingualText;
  minimumBeneficiaries: number;
  officeLocation: BilingualText;
  sessionCreationGraceDays: number;
  sessionMemberDetails: SessionMemberDetails[] = new Array<SessionMemberDetails>();
  sessionTemplateId: number;
  startDate: GosiCalendar = new GosiCalendar();
  startTime: string;
  participantsList: AddParticipantsList[];
}
