import { BilingualText } from '@gosi-ui/core';
export class ContractedMemberWrapper {
  totalCount: number;
  sessionMembers: ContractedMembers[];
}
export class ContractedMembers {
  contractId: number = undefined;
  inviteeId:number = undefined;
  contractType: BilingualText = new BilingualText();
  doctorName: BilingualText = new BilingualText();
  location: BilingualText[] = [];
  isAvailable: boolean;
  mbProfessionalId: number = undefined;
  memberType: BilingualText = new BilingualText();
  medicalBoardType: string;
  mobileNumber: string;
  nationalId: number = undefined;
  speciality: BilingualText[] = [];
  subSpeciality: BilingualText[] = [];
  nationalIdType: string;
  isIconClicked?: boolean;
  isHide?:Boolean;
  isUnavailableDr: boolean = false;
}
