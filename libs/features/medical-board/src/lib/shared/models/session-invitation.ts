import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class SessionInvitationDetails {
  channel: BilingualText = new BilingualText();
  fieldOffice: BilingualText = new BilingualText();
  inviteId: 0;
  maximumBeneficiaries: number;
  medicalBoardType: BilingualText = new BilingualText();
  noOfDoctorsAccepted: number;
  noOfDoctorsInvited: number;
  noOfParticipants: number;
  sessionDate: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
  sessionEndTime: string;
  sessionId: number;
  sessionStartTime: string;
  sessionType: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  templateId: number;
  isEnabled: boolean;
  paymentStatus: BilingualText = new BilingualText();
}
