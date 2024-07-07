import { BilingualText } from '@gosi-ui/core';

export class SessionSpecialityDetails {
  doctorName: BilingualText;
  nationalId: number;
  inviteeId?:number;
  memberType?: BilingualText;
  allocationPercent?:number;
  doctorType: BilingualText;
  sessionSpecialityId: number;
  speciality: BilingualText[] = [];
  subSpeciality: BilingualText[] = [];
  contactNumber?: string;
  contractType: BilingualText;
  isHide?:Boolean;
  isUnavailableDr =false;
  professionalId?:number;
}
