import { BilingualText } from '@gosi-ui/core';

export class RescheduleSessionList {
  identity: number;
  mbProfessionId: number;
  mobileNo: string;
  name: BilingualText;
  contractType: BilingualText;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
  inviteeId?: number;
  isUnAvailable?: boolean;
  isDisabled?:boolean;
  canAmbRemove?: boolean;
  canPmbRemove?: boolean;
}
