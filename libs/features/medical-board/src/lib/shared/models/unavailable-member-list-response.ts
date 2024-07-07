import { BilingualText } from '@gosi-ui/core';

export class UnAvailableMemberListResponse {
  mbProfessionId: number = undefined;
  inviteId?: number = undefined;
  contractId: number = undefined;
  identity: number = undefined;
  inviteeId: number = undefined;
  isRemoved: number = undefined;
  memberType: BilingualText;
  name: BilingualText;
  sessionSpecialityId: number = undefined;
  speciality: BilingualText;
  subSpeciality: BilingualText;
}
