import { BilingualText } from '@gosi-ui/core';
export class SessionFilterRequest {
  status: BilingualText[] = [];
  fieldOffice: BilingualText[] = [];
  sessionType: BilingualText[] = [];
  medicalBoardType: BilingualText[] = [];
  channel: BilingualText[] = [];
  slot: BilingualText[] = [];
  specialty: BilingualText[] = [];
  subSpecialty: BilingualText[] = [];
  sessionPeriodFrom: Date = undefined;
  sessionPeriodTo: Date = undefined;
  searchkey: string;
  initiatorLocation?: string;
  listOfSecSpecialty?:BilingualText[]=[] ;
}
