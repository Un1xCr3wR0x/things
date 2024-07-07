import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Treatments } from './treatments';

export class InjuryHistoryData {
  actualStatus: BilingualText = new BilingualText();
  addComplicationAllowed: boolean;
  benefitPresent: boolean;
  complicationHistory: InjuryHistoryData[];
  date: GosiCalendar = new GosiCalendar();
  engagementId: number;
  establishmentName: BilingualText = new BilingualText();
  establishmentRegNo: number;
  injuryId: number;
  injuryNo: number;
  injuryReason: BilingualText = new BilingualText();
  injuryType: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  treatments: Treatments[];
  type: BilingualText = new BilingualText();
  numberofDays?: number;
  trtmentStartDate?: GosiCalendar = new GosiCalendar();
  trtmentEndDate?: GosiCalendar = new GosiCalendar();
  payableAmount: number;
  isComplication?: boolean;
  complicationsInjuryId?: number;
  simisInjury?: boolean;
}
