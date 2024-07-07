import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class SessionDetails {
  //holdDetails: null
  beneficiarySlotOpenDays: number = undefined;
  days: BilingualText[] = [];
  doctorDetails: null;
  doctorInviteCancelGraceDays: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  endTime: string = undefined;
  medicalBoardType: BilingualText = new BilingualText();
  minimumBeneficiaries: number = undefined;
  officeLocation: BilingualText = new BilingualText();
  sessionChannel: BilingualText = new BilingualText();
  sessionCreationGraceDays: number = undefined;
  sessionFrequency: BilingualText = new BilingualText();
  sessionTemplateId: number = undefined;
  sessionType: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  startTime: string = undefined;
  status: BilingualText = new BilingualText();
}
